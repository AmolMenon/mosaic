export interface CandidateMention {
  matchedText: string;
  entityType: string;
  chunkId: string;
  pageNumber: number;
  readingOrder: number;
  offsets: [number, number];
  boundingBox?: number[];
  contextWindow: string;
  confidence: number;
}

export interface EntityMatcher {
  extract(chunk: any): CandidateMention[];
}
