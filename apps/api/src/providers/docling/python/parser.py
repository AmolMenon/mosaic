from docling.document_converter import DocumentConverter
from mapper import map_docling_to_dict

def parse_document(filepath: str, config: dict) -> dict:
    # Real Docling integration
    converter = DocumentConverter()
    doc = converter.convert(filepath)
    
    return map_docling_to_dict(doc.document)
