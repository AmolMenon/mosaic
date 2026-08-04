def map_docling_to_dict(doc) -> dict:
    # This function translates the rich Docling internal representation
    # into a clean JSON-serializable dictionary that the TypeScript Mapper can consume.
    
    result = {
        "metadata": {
            "title": getattr(doc.metadata, 'title', None),
            "page_count": len(doc.pages) if hasattr(doc, 'pages') else 0
        },
        "pages": [],
        "items": []
    }

    if hasattr(doc, 'pages'):
        for page_no, page in doc.pages.items():
            result["pages"].append({
                "page_no": page_no,
                "size": [page.size.width, page.size.height] if hasattr(page, 'size') else []
            })
    
    # Extract items (headings, paragraphs, tables) in reading order
    if hasattr(doc, 'items'):
        for item in doc.items:
            item_dict = {
                "type": getattr(item, 'label', 'unknown'),
                "text": item.text if hasattr(item, 'text') else None,
                "page_no": item.prov[0].page_no if hasattr(item, 'prov') and item.prov else None,
                "bbox": item.prov[0].bbox.as_tuple() if hasattr(item, 'prov') and item.prov and hasattr(item.prov[0], 'bbox') else None,
            }
            if item_dict["type"] == "heading":
                item_dict["level"] = getattr(item, 'level', 1)
                
            result["items"].append(item_dict)

    return result
