from mapper import map_docling_to_dict

def parse_document(filepath: str, config: dict) -> dict:
    if config.get("debugMode", False):
        return {
            "metadata": {
                "title": "Mock PDF Title",
                "page_count": 1
            },
            "pages": [
                { "page_no": 1, "size": [800, 600] }
            ],
            "items": [
                { "type": "paragraph", "text": "Mock text chunk 1", "level": 1, "page_no": 1, "bbox": [0, 0, 100, 100] }
            ]
        }
        
    # Real Docling integration
    try:
        from docling.document_converter import DocumentConverter
    except ImportError:
        raise RuntimeError("Docling is not installed. Cannot parse document.")
        
    converter = DocumentConverter()
    doc = converter.convert(filepath)
    
    return map_docling_to_dict(doc.document)
