#!/usr/bin/env python3
"""Empaqueta el export de una sola página (.next-spa) como artifact:
fragmento HTML sin <html>/<head>/<body>, CSS en línea con fuentes como data URI
y rutas relativas a ./_next/ para los scripts."""
import base64, os, re, shutil, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(root, ".next-spa")
dst = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, "artifact")
shutil.rmtree(dst, ignore_errors=True)
os.makedirs(dst)

html = open(os.path.join(src, "index.html"), encoding="utf-8").read()
head = re.search(r"<head>(.*)</head>", html, re.S).group(1)
body = re.search(r"<body[^>]*>(.*)</body>", html, re.S).group(1)

def font_uri(m):
    path = os.path.join(src, m.group(1).lstrip("/"))
    data = base64.b64encode(open(path, "rb").read()).decode()
    return f"url(data:font/woff2;base64,{data})"

styles = []
for href in re.findall(r'<link rel="stylesheet" href="([^"]+)"[^>]*>', head):
    css = open(os.path.join(src, href.lstrip("/")), encoding="utf-8").read()
    css = re.sub(r"url\((/_next/static/media/[^)]+\.woff2)\)", font_uri, css)
    styles.append(css)
head = re.sub(r'<link rel="stylesheet"[^>]*>', "", head)
head = re.sub(r'<link rel="preload"[^>]*as="font"[^>]*>', "", head)
head = re.sub(r'<meta charSet="utf-8"/>|<meta name="viewport"[^>]*/>', "", head)
head = re.sub(r'<link rel="icon"[^>]*>', "", head)
html_attrs = re.search(r"<html([^>]*)>", html).group(1)
cls = re.search(r'class="([^"]*)"', html_attrs).group(1)
lang = re.search(r'lang="([^"]*)"', html_attrs).group(1)
title = re.search(r"<title>.*?</title>", head).group(0)
new_title = "<title>Cookies Tandil app</title>"
head = head.replace(title, "")

page = (
    new_title
    + '\n<meta name="claude:viewport-fit-sides" content="cover">\n'
    + f'<script>document.documentElement.className="{cls}";document.documentElement.lang="{lang}"</script>\n'
    + "<style>" + "\n".join(styles) + "</style>\n"
    + head.replace('"/_next/', '"./assets/') + "\n"
    + body.replace('"/_next/', '"./assets/').replace('\\"/_next/', '\\"./assets/')
)
open(os.path.join(dst, "index.html"), "w", encoding="utf-8").write(page)

# copiar JS y hacer relativo el publicPath del runtime de webpack
n = 0
for dirpath, _, files in os.walk(os.path.join(src, "_next", "static")):
    for f in files:
        if not f.endswith((".js", ".css", ".woff2")):
            continue
        rel = os.path.relpath(os.path.join(dirpath, f), os.path.join(src, "_next"))
        rel = os.path.join("assets", rel)
        out = os.path.join(dst, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        if f.endswith(".js"):
            js = open(os.path.join(dirpath, f), encoding="utf-8").read()
            open(out, "w", encoding="utf-8").write(js.replace('"/_next/"', '"./assets/"').replace('\ufffd', '\\ufffd'))
        else:
            shutil.copy(os.path.join(dirpath, f), out)
        n += 1
# fotos de las cookies
for f in sorted(os.listdir(os.path.join(root, "public", "cookies"))):
    os.makedirs(os.path.join(dst, "cookies"), exist_ok=True)
    shutil.copy(os.path.join(root, "public", "cookies", f), os.path.join(dst, "cookies", f))
    n += 1
print(f"index.html {os.path.getsize(os.path.join(dst,'index.html'))//1024} KB, {n} archivos")
