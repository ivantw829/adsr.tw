from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from bs4 import BeautifulSoup
import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi.requests import Request

app = FastAPI()

# 允許前端跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PAPERS_DIR = Path(__file__).parent / "frontend" / "papers" / "pages"

# 取得所有文章 meta 資訊
@app.get("/api/papers")
def get_papers():
    papers = []
    for html_file in PAPERS_DIR.glob("*.html"):
        with open(html_file, encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
            title = soup.title.string.strip() if soup.title and soup.title.string else html_file.name
            desc = soup.find("meta", attrs={"name": "description"})
            desc = desc["content"].strip() if desc and desc.has_attr("content") else ""
            date = soup.find("meta", attrs={"name": "date"})
            date = date["content"].strip() if date and date.has_attr("content") else ""
            category = soup.find("meta", attrs={"name": "category"})
            category = category["content"].strip() if category and category.has_attr("content") else ""
            author = soup.find("meta", attrs={"name": "author"})
            thumbnail = soup.find("meta", attrs={"name": "thumbnail"})
            thumbnail = thumbnail["content"].strip() if thumbnail and thumbnail.has_attr("content") else ""
            papers.append({
                "filename": html_file.name,
                "title": title,
                "description": desc,
                "date": date,
                "category": category,
                "author": author,
                "thumbnail": thumbnail
            })
    # 依日期排序（新到舊）
    papers.sort(key=lambda x: x["date"], reverse=True)
    return papers

# 取得單篇文章 HTML
@app.get("/api/paper/{filename}")
def get_paper(filename: str):
    file_path = PAPERS_DIR / filename
    if not file_path.exists() or file_path.suffix != ".html":
        raise HTTPException(status_code=404, detail="Paper not found")
    return FileResponse(str(file_path), media_type="text/html")

# 掛載 frontend 為靜態網站根目錄，API 路由優先
app.mount("/", StaticFiles(directory="frontend", html=True), name="static")

# 404 handler: 非 /api/ 路徑時導向 index.html
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    if request.url.path.startswith("/api/"):
        return await app.default_exception_handler(request, exc)
    index_path = Path(__file__).parent / "frontend" / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path), media_type="text/html")
    return exc


# 動態產生 sitemap.xml
from fastapi.responses import Response
import datetime

@app.get("/sitemap.xml", response_class=Response)
def sitemap():
    base_url = "https://adsr.tw"
    pages_dir = Path(__file__).parent / "frontend" / "pages"
    papers_pages_dir = Path(__file__).parent / "frontend" / "papers" / "pages"
    urls = []
    # 首頁
    urls.append({
        "loc": f"{base_url}/",
        "priority": "1.0",
        "lastmod": datetime.date.today().isoformat(),
        "changefreq": "daily"
    })
    # frontend/pages/*.html
    if pages_dir.exists():
        for html_file in sorted(pages_dir.glob("*.html")):
            urls.append({
                "loc": f"{base_url}/pages/{html_file.name}",
                "priority": "0.8",
                "lastmod": datetime.date.fromtimestamp(html_file.stat().st_mtime).isoformat(),
                "changefreq": "monthly"
            })
    # frontend/papers/pages/*.html
    if papers_pages_dir.exists():
        for html_file in sorted(papers_pages_dir.glob("*.html")):
            urls.append({
                "loc": f"{base_url}/papers/pages/{html_file.name}",
                "priority": "0.7",
                "lastmod": datetime.date.fromtimestamp(html_file.stat().st_mtime).isoformat(),
                "changefreq": "monthly"
            })
    # 產生 XML
    xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for url in urls:
        xml.append("  <url>")
        xml.append(f"    <loc>{url['loc']}</loc>")
        xml.append(f"    <lastmod>{url['lastmod']}</lastmod>")
        xml.append(f"    <changefreq>{url['changefreq']}</changefreq>")
        xml.append(f"    <priority>{url['priority']}</priority>")
        xml.append("  </url>")
    xml.append("</urlset>")
    return Response("\n".join(xml), media_type="application/xml")


# 寫入 sitemap.xml 到 frontend/sitemap.xml
def write_sitemap_file():
    base_url = "https://adsr.tw"
    pages_dir = Path(__file__).parent / "frontend" / "pages"
    papers_pages_dir = Path(__file__).parent / "frontend" / "papers" / "pages"
    urls = []
    urls.append({
        "loc": f"{base_url}/",
        "priority": "1.0",
        "lastmod": datetime.date.today().isoformat(),
        "changefreq": "daily"
    })
    if pages_dir.exists():
        for html_file in sorted(pages_dir.glob("*.html")):
            urls.append({
                "loc": f"{base_url}/pages/{html_file.name}",
                "priority": "0.8",
                "lastmod": datetime.date.fromtimestamp(html_file.stat().st_mtime).isoformat(),
                "changefreq": "monthly"
            })
    if papers_pages_dir.exists():
        for html_file in sorted(papers_pages_dir.glob("*.html")):
            urls.append({
                "loc": f"{base_url}/papers/pages/{html_file.name}",
                "priority": "0.7",
                "lastmod": datetime.date.fromtimestamp(html_file.stat().st_mtime).isoformat(),
                "changefreq": "monthly"
            })
    xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for url in urls:
        xml.append("  <url>")
        xml.append(f"    <loc>{url['loc']}</loc>")
        xml.append(f"    <lastmod>{url['lastmod']}</lastmod>")
        xml.append(f"    <changefreq>{url['changefreq']}</changefreq>")
        xml.append(f"    <priority>{url['priority']}</priority>")
        xml.append("  </url>")
    xml.append("</urlset>")
    sitemap_path = Path(__file__).parent / "frontend" / "sitemap.xml"
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(xml))

# 啟動時自動寫入 sitemap
write_sitemap_file()

# 提供 API 讓前端可手動觸發 sitemap 重新產生
@app.post("/api/generate_sitemap")
def api_generate_sitemap():
    write_sitemap_file()
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
