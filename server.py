#!/usr/bin/env python3
"""
Simple HTTP Server with UTF-8 headers for portfolio
"""
import http.server
import socketserver
import os
from urllib.parse import urlparse

class UTF8HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add UTF-8 encoding headers
        self.send_header('Content-Type', self.guess_type_with_utf8())
        super().end_headers()
    
    def guess_type_with_utf8(self):
        path = self.translate_path(self.path)
        base, ext = os.path.splitext(path)
        
        if ext in ('.html', '.htm'):
            return 'text/html; charset=utf-8'
        elif ext == '.css':
            return 'text/css; charset=utf-8'
        elif ext == '.js':
            return 'application/javascript; charset=utf-8'
        elif ext == '.json':
            return 'application/json; charset=utf-8'
        else:
            content_type = self.guess_type(path)
            if isinstance(content_type, tuple):
                content_type = content_type[0]
            if content_type and content_type.startswith('text/'):
                return f'{content_type}; charset=utf-8'
            return content_type or 'application/octet-stream'

if __name__ == '__main__':
    PORT = 8002
    
    with socketserver.TCPServer(("", PORT), UTF8HTTPRequestHandler) as httpd:
        print(f"🚀 Portfolio server running at http://localhost:{PORT}")
        print("📝 Serving with UTF-8 encoding support")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")
