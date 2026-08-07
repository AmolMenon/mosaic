import { BaseProvider, ExecutionResult } from "../base/BaseProvider";
import { ProviderContext } from "../base/ProviderContext";
import { ProviderConfiguration } from "../base/ProviderConfiguration";
import { PipelineArtifact } from "@mosaic/contracts";
import { DoclingHealth } from "./DoclingHealth";
import { DoclingMetrics } from "./DoclingMetrics";
import { DoclingConfiguration } from "./DoclingConfiguration";
import { ConfigurationError, ProviderUnavailable } from "../base/ProviderErrors";
import { ParsingFailure, UnsupportedDocument } from "./DoclingErrors";
import { DoclingMapper, DoclingRawOutput } from "./DoclingMapper";
import { DoclingArtifactFactory } from "./DoclingArtifactFactory";
import { spawn, ChildProcess } from "child_process";
import * as path from "path";
import * as readline from "readline";

export class DoclingProvider implements BaseProvider {
  private config!: DoclingConfiguration;
  private pythonProcess?: ChildProcess;
  private rl?: readline.Interface;
  private messageQueue: Array<(val: any) => void> = [];
  
  private metricsData: DoclingMetrics = {
    executionCount: 0,
    averageLatencyMs: 0,
    totalRuntimeMs: 0,
    warningsCount: 0,
    failuresCount: 0,
    providerVersion: "2.0.0-docling",
    pagesParsed: 0,
    sectionsParsed: 0,
    paragraphCount: 0,
    chunksProduced: 0,
    tablesExtracted: 0,
    figuresExtracted: 0,
    imagesExtracted: 0,
    parserVersion: "1.0"
  };

  async initialize(config: ProviderConfiguration): Promise<void> {
    this.config = config as DoclingConfiguration;
    
    // Start Python worker process
    const scriptPath = path.join(__dirname, "python", "service.py");
    this.pythonProcess = spawn("python3", [scriptPath], {
      stdio: ["pipe", "pipe", "inherit"] // stdin, stdout, stderr (pass through for logs)
    });

    if (!this.pythonProcess.stdout || !this.pythonProcess.stdin) {
      throw new ProviderUnavailable("Failed to start Python worker");
    }

    this.rl = readline.createInterface({
      input: this.pythonProcess.stdout
    });

    this.rl.on("line", (line) => {
      try {
        const response = JSON.parse(line);
        const resolve = this.messageQueue.shift();
        if (resolve) resolve(response);
      } catch (e) {
        console.error("Failed to parse Python output:", line);
      }
    });

    // Ping test
    const ping = await this.sendToPython({ command: "ping" });
    if (ping.status !== "success") {
      throw new ProviderUnavailable("Python worker failed to respond to ping");
    }
  }

  validateConfiguration(config: ProviderConfiguration): void {
    if (!config.providerId) throw new ConfigurationError("Missing providerId");
    // Could add more strict type checks for DoclingConfiguration properties
  }

  private sendToPython(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.pythonProcess || !this.pythonProcess.stdin) {
        return reject(new ProviderUnavailable("Python worker is not running"));
      }
      this.messageQueue.push(resolve);
      this.pythonProcess.stdin.write(JSON.stringify(payload) + "\n");
    });
  }

  async execute(inputs: PipelineArtifact[], context: ProviderContext): Promise<ExecutionResult> {
    const startTime = Date.now();
    const pdfArtifact = inputs.find(a => a.type === 'raw_pdf');
    if (!pdfArtifact) throw new UnsupportedDocument("DoclingProvider requires a raw_pdf artifact");

    // Extract filepath (mocking that payload has { url: string } or { filepath: string })
    const filepath = pdfArtifact.payload.filepath || pdfArtifact.payload.url;
    
    let pythonResponse;
    try {
      pythonResponse = await this.sendToPython({
        command: "parse",
        filepath: filepath,
        config: this.config
      });
    } catch (e) {
      this.metricsData.failuresCount++;
      throw new ParsingFailure(`Failed to communicate with python worker: ${e}`);
    }

    if (pythonResponse.status !== "success") {
      this.metricsData.failuresCount++;
      throw new ParsingFailure(`Docling failed: ${pythonResponse.error}`);
    }

    const rawOutput: DoclingRawOutput = pythonResponse.data;
    
    const structure = DoclingMapper.mapToDomain(rawOutput);
    const artifacts = DoclingArtifactFactory.createArtifacts(structure, {
      documentId: context.workflowId, // Using workflowId as documentId proxy for simplicity
      pipelineId: context.workflowId,
      executionId: context.stageId,
      provider: "docling",
      providerVersion: "2.0.0"
    });

    const executionTime = Date.now() - startTime;
    this.metricsData.executionCount++;
    this.metricsData.totalRuntimeMs += executionTime;
    this.metricsData.averageLatencyMs = this.metricsData.totalRuntimeMs / this.metricsData.executionCount;
    this.metricsData.pagesParsed += structure.pages;
    this.metricsData.chunksProduced += artifacts.filter(a => a.type === 'TextChunk').length;

    return {
      artifacts,
      metrics: this.metricsData,
      warnings: []
    };
  }

  async health(): Promise<DoclingHealth> {
    try {
      const ping = await this.sendToPython({ command: "ping" });
      const healthy = ping.status === "success";
      return {
        status: healthy ? "Healthy" : "Degraded",
        lastChecked: new Date().toISOString(),
        pythonRuntimeStatus: healthy ? "Healthy" : "Unavailable",
        doclingImportStatus: healthy ? "Healthy" : "Unavailable", // We'd check actual import in a full ping
        packageVersion: "2.0.0"
      };
    } catch (e) {
      return {
        status: "Unavailable",
        lastChecked: new Date().toISOString(),
        pythonRuntimeStatus: "Unavailable",
        doclingImportStatus: "Unavailable",
        packageVersion: "2.0.0"
      };
    }
  }

  metrics(): DoclingMetrics {
    return this.metricsData;
  }

  async shutdown(): Promise<void> {
    if (this.pythonProcess) {
      if (this.pythonProcess.stdin) {
        this.pythonProcess.stdin.write("exit\n");
      }
      this.pythonProcess.kill();
    }
  }
}
