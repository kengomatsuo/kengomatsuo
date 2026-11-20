"""Run by deploy.sh on the built site: every page gets a canonical URL, and
sitemap.xml lists every page with the date its source last changed.

Cloudflare Pages answers every unknown path with the home page and 200 when the
build has no top-level 404.html, so deploy.sh must keep copying 404.html.
"""
import pathlib
import subprocess
import sys

BASE = "https://matsuokengo.com"


def main(dist: pathlib.Path) -> None:
    urls = []
    for page in sorted(dist.rglob("index.html")):
        rel = page.parent.relative_to(dist).as_posix()
        url = BASE + "/" + ("" if rel == "." else rel + "/")
        html = page.read_text(encoding="utf-8")
        if 'rel="canonical"' not in html:
            html = html.replace("</title>", f'</title>\n    <link rel="canonical" href="{url}" />', 1)
            page.write_text(html, encoding="utf-8")
        src = "index.html" if rel == "." else f"{rel}/index.html"
        day = subprocess.run(["git", "log", "-1", "--format=%cs", "--", src],
                             capture_output=True, text=True).stdout.strip()
        urls.append((url, day))
    body = "".join(f"<url><loc>{u}</loc>" + (f"<lastmod>{d}</lastmod>" if d else "") + "</url>\n"
                   for u, d in urls)
    (dist / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "</urlset>\n",
        encoding="utf-8")
    print(f"sitemap.xml: {len(urls)} pages")


if __name__ == "__main__":
    main(pathlib.Path(sys.argv[1]))
