from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import HTTPException
import pathlib, uvicorn

# ─── tutorial "TOC" ───────────────────────────────────────
CATEGORIES = [
    ("angle-movement", [
        "Overview",            # page 0
        "Dutch Angle",         # page 1
        "Low / High Angle",    # page 2
        "POV Shot",            # page 3
        "Camera Movement"      # page 4
    ]),
    ("shot-composition", [
        "Overview",
        "Shot Types",
        "Composition Techniques"
    ]),
    ("editing-transition", [
        "Editing and Transition Overview",
        "Cuts",
        "Transitions"
    ]),
    ("visual-storytelling", [
        "Visual and Storytelling Overview",
        "Color & Lighting",
        "Symbolism"
    ])
]

# quick look‑ups
SLUGS       = [s for s, _ in CATEGORIES]
PAGE_TITLES = {s: pages for s, pages in CATEGORIES}
SLUG_LABEL  = {
    "angle-movement":      "Angles & Movement",
    "shot-composition":    "Shots & Compositions",
    "editing-transition":  "Editing & Transitions",
    "visual-storytelling": "Visual Storytelling"
}


BASE = pathlib.Path(__file__).resolve().parent
app = FastAPI(title="Essential Cinematography Tutorial")

# ── assets ───────────────────────────────────────────────
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE / "templates"))

# ── simple pages ─────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "page": "home"})

@app.get("/overview", response_class=HTMLResponse)
def overview(request: Request):
    return templates.TemplateResponse("overview.html", {"request": request, "page": "overview"})

@app.get("/quiz", response_class=HTMLResponse)
def quiz(request: Request):
    return templates.TemplateResponse("quiz.html", {"request": request, "page": "quiz"})

@app.get("/contact", response_class=HTMLResponse)
def contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request, "page": "contact"})

SLUG_MAP = {
    "angle-movement":        "Angles & Movement",
    "shot-composition":      "Shots & Compositions",
    "editing-transition":    "Editing & Transitions",
    "visual-storytelling":   "Visual Storytelling"
}

@app.get("/category/{slug}", response_class=HTMLResponse)
@app.get("/category/{slug}/{page_idx}", response_class=HTMLResponse)
def tutorial_page(request: Request, slug: str, page_idx: int = 0):
    if slug not in PAGE_TITLES:
        raise HTTPException(404)

    pages     = PAGE_TITLES[slug]
    if page_idx < 0 or page_idx >= len(pages):
        raise HTTPException(404)

    # prev
    if page_idx > 0:
        prev_url = f"/category/{slug}/{page_idx-1}" if page_idx > 1 else f"/category/{slug}"
    else:
        # go to last page of previous category (if any)
        curr_pos = SLUGS.index(slug)
        prev_url = None
        if curr_pos > 0:
            prev_slug = SLUGS[curr_pos-1]
            prev_len  = len(PAGE_TITLES[prev_slug])
            prev_url  = f"/category/{prev_slug}/{prev_len-1}" if prev_len > 1 else f"/category/{prev_slug}"

    # next
    if page_idx < len(pages)-1:
        next_url = f"/category/{slug}/{page_idx+1}"
    else:
        # first page of next category or to quiz
        curr_pos = SLUGS.index(slug)
        next_url = None
        if curr_pos < len(SLUGS)-1:
            next_slug = SLUGS[curr_pos+1]
            next_url  = f"/category/{next_slug}"
        else:                       # finished last section
            next_url = "/quiz"

    content_fragment = f"tutorial/{slug}/{page_idx}.html"

    return templates.TemplateResponse(
        "tutorial_page.html",
        {
            "request": request,
            "page": "tutorial",
            "slug": slug,
            "title": SLUG_LABEL[slug],
            "heading": pages[page_idx],
            "prev_url": prev_url,
            "next_url": next_url,
            "content_fragment": content_fragment
        }
    )

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
