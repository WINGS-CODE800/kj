#!/usr/bin/env python3
"""
KIKI AI — macOS Native Automation Companion
Allows KIKI AI to safely control your MacBook applications, launch software,
simulate voice typing, and navigate spreadsheets using macOS AppleScript.
"""

import sys
import os
import json
import subprocess
import http.server
import socketserver
import urllib.parse

PORT = 5055

WEB_SERVICES = {
    "instagram": "https://www.instagram.com",
    "youtube": "https://www.youtube.com",
    "facebook": "https://www.facebook.com",
    "whatsapp": "https://web.whatsapp.com",
    "twitter": "https://x.com",
    "x": "https://x.com",
    "linkedin": "https://www.linkedin.com",
    "netflix": "https://www.netflix.com",
    "github": "https://github.com",
    "chatgpt": "https://chatgpt.com"
}

ALLOWED_APPS = {
    "visual studio code": "Visual Studio Code",
    "vscode": "Visual Studio Code",
    "vs code": "Visual Studio Code",
    "code": "Visual Studio Code",
    "excel": "Microsoft Excel",
    "microsoft excel": "Microsoft Excel",
    "chrome": "Google Chrome",
    "google chrome": "Google Chrome",
    "safari": "Safari",
    "notes": "Notes",
    "terminal": "Terminal",
    "calculator": "Calculator",
    "finder": "Finder",
    "downloads": "Downloads",
    "spotify": "Spotify",
    "slack": "Slack",
    "discord": "Discord",
    "whatsapp": "WhatsApp"
}

def run_applescript(script: str) -> dict:
    """Safely executes an AppleScript snippet via osascript."""
    try:
        process = subprocess.run(
            ['osascript', '-e', script],
            capture_output=True,
            text=True,
            timeout=10
        )
        return {
            "success": process.returncode == 0,
            "stdout": process.stdout.strip(),
            "stderr": process.stderr.strip()
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def launch_application(app_name: str) -> dict:
    """Launches or activates an authorized macOS app or web service fallback."""
    key = app_name.lower().strip()

    # Check web-first platforms (Instagram, YouTube, Facebook, etc.)
    if key in WEB_SERVICES:
        url = WEB_SERVICES[key]
        cmd = f'open "{url}"'
        res = run_applescript(cmd)
        res["app"] = f"{app_name.capitalize()} (Web)"
        res["url"] = url
        return res

    resolved = ALLOWED_APPS.get(key, app_name)

    if resolved == "Downloads":
        cmd = 'tell application "Finder" to open (path to downloads folder)'
    else:
        cmd = f'tell application "{resolved}" to activate'

    res = run_applescript(cmd)
    if not res.get("success"):
        # Fallback 1: Dynamic Spotlight mdfind discovery across all Mac drives
        try:
            query = f'kMDItemDisplayName == "*{resolved}*"c && kMDItemContentType == "com.apple.application-bundle"'
            find_proc = subprocess.run(['mdfind', query], capture_output=True, text=True, timeout=3)
            paths = [p for p in find_proc.stdout.strip().split('\n') if p.endswith('.app')]
            if paths:
                app_path = paths[0]
                open_res = subprocess.run(['open', app_path], capture_output=True, text=True, timeout=5)
                if open_res.returncode == 0:
                    return {"success": True, "app": resolved, "path": app_path}
        except Exception:
            pass

        # Fallback 2: Shell 'open -a'
        try:
            p = subprocess.run(['open', '-a', resolved], capture_output=True, text=True, timeout=5)
            if p.returncode == 0:
                return {"success": True, "app": resolved}
        except Exception:
            pass

    res["app"] = resolved
    return res

def type_text(text: str) -> dict:
    """Types text directly into the currently focused macOS text field."""
    # Escape quotes and backslashes for AppleScript
    safe_text = text.replace('\\', '\\\\').replace('"', '\\"')
    script = f'tell application "System Events" to keystroke "{safe_text}"'
    return run_applescript(script)

def undo_typing() -> dict:
    """Triggers Command+Z in the active macOS application."""
    script = 'tell application "System Events" to keystroke "z" using command down'
    return run_applescript(script)

def set_excel_cell(cell: str, value: str) -> dict:
    """Directly sets a cell value in Microsoft Excel on Mac if open."""
    safe_val = value.replace('"', '\\"')
    script = f'''
    tell application "Microsoft Excel"
        activate
        set value of range "{cell}" of active sheet to "{safe_val}"
    end tell
    '''
    res = run_applescript(script)
    if not res.get("success"):
        # Fallback to keystroke navigation
        fallback = f'tell application "System Events" to keystroke "{safe_val}"'
        return run_applescript(fallback)
    return res

def get_selected_text() -> dict:
    """Copies current selection in macOS and returns it."""
    # Press Cmd+C to copy current selection
    copy_script = 'tell application "System Events" to keystroke "c" using command down'
    run_applescript(copy_script)
    # Read from pbpaste
    try:
        text = subprocess.check_output(['pbpaste'], text=True, timeout=2)
        return {"success": True, "selectedText": text}
    except Exception as e:
        return {"success": False, "error": str(e)}

class KikiCompanionHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            status = {
                "status": "connected",
                "companion": "KIKI macOS Bridge",
                "platform": "darwin",
                "version": "1.0.0"
            }
            self.wfile.write(json.dumps(status).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        try:
            req = json.loads(post_data) if post_data else {}
        except Exception:
            req = {}

        action = req.get('action')
        result = {"success": False, "error": "Unknown action"}

        if action == 'launch_app':
            result = launch_application(req.get('appName', ''))
        elif action == 'type_text':
            result = type_text(req.get('text', ''))
        elif action == 'undo':
            result = undo_typing()
        elif action == 'excel_cell':
            result = set_excel_cell(req.get('cell', 'A1'), req.get('value', ''))
        elif action == 'get_selection':
            result = get_selected_text()
        elif action == 'open_folder':
            folder = req.get('folder', 'Downloads')
            if folder.lower() == 'downloads':
                result = run_applescript('tell application "Finder" to open (path to downloads folder)')
            else:
                result = run_applescript(f'tell application "Finder" to open folder "{folder}" of home')

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode('utf-8'))

    def log_message(self, format, *args):
        # Quiet logging
        pass

def main():
    print(f"=====================================================")
    print(f"  KIKI AI — macOS Native Automation Companion")
    print(f"  Listening on http://localhost:{PORT}")
    print(f"  Ready to launch apps, type text, and control Excel.")
    print(f"=====================================================")
    with socketserver.TCPServer(("", PORT), KikiCompanionHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nKIKI Companion stopped.")

if __name__ == '__main__':
    main()
