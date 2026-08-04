export interface DoclingRawOutput {
  metadata: {
    title?: string;
    page_count: number;
  };
  pages: { page_no: number; size: number[] }[];
  items: {
    type: string;
    text?: string;
    level?: number;
    page_no?: number;
    bbox?: number[];
  }[];
}

export interface MosaicDocumentStructure {
  title: string;
  pages: number;
  items: any[];
}

export class DoclingMapper {
  static mapToDomain(raw: DoclingRawOutput): MosaicDocumentStructure {
    // Pure transformation, no provenance yet
    return {
      title: raw.metadata.title || "Untitled Document",
      pages: raw.metadata.page_count,
      items: raw.items.map(item => ({
        type: item.type,
        content: item.text,
        metadata: {
          level: item.level,
          pageNumber: item.page_no,
          boundingBox: item.bbox
        }
      }))
    };
  }
}
