import { PipelineArtifact } from "@mosaic/contracts";
import { ScoredHypothesis } from "./HypothesisScorer";
import * as crypto from "crypto";

export interface ReasoningTrace {
  promptVersion: string;
  modelProvider: string;
  modelVersion: string;
  temperature: number;
  contextHash: string;
  inputEvidenceIds: string[];
  outputHypothesisIds: string[];
  validationResults: any;
  tokenUsage: number;
  runtime: number;
}

export interface HypothesisArtifactContext {
  pipelineId: string;
  executionId: string;
  provider: string;
  providerVersion: string;
  documentId: string;
  timestamp: string;
}

export class HypothesisArtifactFactory {
  
  static createArtifacts(
    hypotheses: ScoredHypothesis[],
    trace: ReasoningTrace,
    context: HypothesisArtifactContext
  ): Partial<PipelineArtifact>[] {
    
    const artifacts: Partial<PipelineArtifact>[] = [];

    // Hypothesis Proposal Artifacts
    for (const h of hypotheses) {
      
      // Deterministic ID based on Title and Document
      const hash = crypto.createHash('sha256');
      hash.update(h.title);
      hash.update(context.documentId);
      const hypothesisId = `hyp_${hash.digest('hex').substring(0, 16)}`;

      artifacts.push(this.buildArtifact('HypothesisProposal', {
        id: hypothesisId,
        ...h
      }, context));
    }

    // Reasoning Trace Artifact
    artifacts.push(this.buildArtifact('ReasoningTrace', trace, context));

    return artifacts;
  }

  private static buildArtifact(type: string, payload: any, context: HypothesisArtifactContext): Partial<PipelineArtifact> {
    return {
      type,
      payload,
      provenance: {
        producerStage: context.executionId,
        provider: context.provider,
        pipelineId: context.pipelineId,
        version: 1,
        timestamp: context.timestamp
      }
    };
  }
}
