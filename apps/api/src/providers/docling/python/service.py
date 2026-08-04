import sys
import json
import traceback
from parser import parse_document

def process_request(line: str) -> str:
    try:
        req = json.loads(line)
        if req.get('command') == 'parse':
            filepath = req.get('filepath')
            config = req.get('config', {})
            result = parse_document(filepath, config)
            return json.dumps({
                "status": "success",
                "data": result
            })
        elif req.get('command') == 'ping':
            return json.dumps({"status": "success", "data": "pong"})
        else:
            return json.dumps({"status": "error", "error": "Unknown command"})
    except Exception as e:
        return json.dumps({
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        })

def main():
    # Simple IPC loop reading from stdin and writing to stdout
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        if line == 'exit':
            break
        
        resp = process_request(line)
        print(resp)
        sys.stdout.flush()

if __name__ == "__main__":
    main()
