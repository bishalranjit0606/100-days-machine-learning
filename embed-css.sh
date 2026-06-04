#!/usr/bin/env bash
# Copy styles.css into index.html so the site works when opened as file:// (Brave blocks external CSS).
# Run this after you edit styles.css: ./embed-css.sh
set -e
cd "$(dirname "$0")"
python3 << 'PY'
from pathlib import Path
html_path = Path("index.html")
css_path = Path("styles.css")
html = html_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")
start = html.find('<style id="site-styles-embed">')
end = html.find("</style>", start) if start != -1 else -1
link = '  <link rel="stylesheet" href="styles.css">\n'
block = link + "  <style id=\"site-styles-embed\">\n" + css + "\n  </style>\n"
if start != -1 and end != -1:
    html = html[:start] + "  <style id=\"site-styles-embed\">\n" + css + "\n  " + html[end:]
else:
    if link not in html:
        raise SystemExit("Could not find stylesheet link in index.html")
    html = html.replace(link, block, 1)
html_path.write_text(html, encoding="utf-8")
print("Updated embedded CSS in index.html from styles.css")
PY
