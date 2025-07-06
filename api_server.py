from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from bs4 import BeautifulSoup
import uvicorn
from fastapi.staticfiles import StaticFiles

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

if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)
