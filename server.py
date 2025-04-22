from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Dict
import pathlib, uvicorn

# ─── tutorial "TOC" ───────────────────────────────────────
CATEGORIES = [
    ("angle-movement", [
        "Overview",            # page 0
        "Dutch Angle",         # page 1
        "Camera Angle"         # page 2
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

# ─── Quiz Page ──────────────────────────
@app.get("/quiz", response_class=HTMLResponse, name="quiz")
def quiz_page(request: Request):
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


# ─── Quiz API ───────────────────────────
QUIZ_ANSWERS = {
    "q1": {
        "correct_answers": ["Low-Key Lighting"],
        "explanation": (
            "Low-key lighting emphasizes deep shadows and high contrast between light "
            "and dark areas. It creates a moody, dramatic, or mysterious atmosphere."
        )
    },
    # q2 always correct
    "q2": {
        "correct_answers": [],
        "explanation": "Great match!"
    },
    "q3": {
        "correct_answers": ["POV shot"],
        "explanation": "A POV shot puts the audience directly in the character’s shoes at that moment of realization."
    },
    "q4": {
        "correct_answers": ["Dutch Angle"],
        "explanation": "Dutch angles skew the frame to convey unease or disorientation in the scene."
    },
    "q5": {
        "correct_answers": ["Fear"],
        "explanation": "The lighting and framing heighten a sense of fear in the character."
    }
}

class QuizSubmission(BaseModel):
    answers: Dict[str, List[str]]

@app.post("/api/quiz/submit")
async def submit_quiz(submission: QuizSubmission):
    score = 0
    feedback = {}

    for q_id, user_list in submission.answers.items():
        key = QUIZ_ANSWERS.get(q_id)
        if not key:
            continue

        expect = {c.strip().lower() for c in key["correct_answers"]}
        got    = {u.strip().lower() for u in user_list}

        correct = (not expect) or (got == expect)
        if correct:
            score += 1

        feedback[q_id] = {
            "correct": correct,
            "explanation": key["explanation"]
        }

    return JSONResponse({"score": score, "feedback": feedback})


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
