import { ProviderMetrics } from "../base/ProviderMetrics";

export interface DoclingMetrics extends ProviderMetrics {
  pagesParsed: number;
  sectionsParsed: number;
  paragraphCount: number;
  chunksProduced: number;
  tablesExtracted: number;
  figuresExtracted: number;
  imagesExtracted: number;
  parserVersion: string;
}
