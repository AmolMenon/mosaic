import { ProviderConfiguration } from "../base/ProviderConfiguration";

export interface DoclingConfiguration extends ProviderConfiguration {
  language: string;
  ocrEnabled: boolean;
  maxPages: number;
  chunkStrategy: "structural" | "semantic";
  extractTables: boolean;
  extractImages: boolean;
  extractFigures: boolean;
  extractCaptions: boolean;
  readingOrder: "natural" | "visual";
}
