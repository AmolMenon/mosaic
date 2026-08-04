export type ProcessingStatus = 'pending' | 'indexing' | 'ready' | 'failed';
export type DocumentSource = 'upload' | 'vdr' | 'email' | 'web';
export type ReadingMode = 'original' | 'evidence' | 'questions' | 'insights' | 'timeline';

export interface DocumentMetadata {
  author?: string;
  publishDate?: string;
  pageCount: number;
  fileSize: number;
  custom: Record<string, string>;
}

export interface Document {
  id: string;
  projectId: string;
  title: string;
  fileName: string;
  source: DocumentSource;
  status: ProcessingStatus;
  version: number;
  metadata: DocumentMetadata;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReadingContext {
  documentId: string | null;
  pageNumber: number | null;
  paragraphIndex: number | null;
  selectedEvidenceId: string | null;
  activeQuestionId: string | null;
  activeInsightId: string | null;
  readingMode: ReadingMode;
}
