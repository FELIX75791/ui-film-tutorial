#server.py
from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import pathlib, uvicorn
import json
import secrets

# Add in-memory session storage
SESSION_STORE = {}  # Will be cleared whenever server restarts

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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── assets ───────────────────────────────────────────────
# Mount static files with explicit name
app.mount("/static", StaticFiles(directory=str(BASE / "static")), name="static")

# Initialize templates with proper request context
templates = Jinja2Templates(directory=str(BASE / "templates"))

# Add custom url_for function to templates
def url_for(name: str, **path_params: str) -> str:
    if name == "static":
        # Handle both filename and path parameters
        file_path = path_params.get('filename') or path_params.get('path', '')
        return f"/static/{file_path}"
    return app.url_path_for(name, **path_params)

templates.env.globals["url_for"] = url_for

# Session handling middleware
@app.middleware("http")
async def session_middleware(request: Request, call_next):
    # Get or create session cookie
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = secrets.token_urlsafe(32)
    
    # Get session data from in-memory store instead of cookie
    session = SESSION_STORE.get(session_id, {})
    
    # Store session in request state
    request.state.session = session
    
    # Process request
    response = await call_next(request)
    
    # Save session back to in-memory store
    SESSION_STORE[session_id] = session
    
    # Save only the session_id to cookie
    if isinstance(response, Response):
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            secure=False,
            samesite="lax"
        )
    
    return response

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


# Quiz Data Structure
QUIZ_DATA = {
    1: {
        "id": 1,
        "type": "identify",
        "title": "Identify Cinematography Techniques",
        "question": "Watch the clip and identify which cinematography techniques are being used (select all that apply)",
        "image": "img/quiz/dutch-angle.jpg",
        "options": ["Dutch Angle", "Low-Key Lighting", "Tracking Shot", "Depth of Field"],
        "correct_answers": ["Dutch Angle", "Low-Key Lighting"],
        "explanation": "This scene uses Dutch Angle to create disorientation and Low-Key Lighting to build atmosphere."
    },
    2: {
        "id": 2,
        "type": "identify",
        "title": "Horror Film Techniques",
        "question": "Identify which cinematography techniques are used in this horror scene",
        "image": "img/quiz/horror-scene.jpg",
        "options": ["Handheld Camera", "High-Key Lighting", "Extreme Close-Up", "Slow Motion"],
        "correct_answers": ["Handheld Camera", "Extreme Close-Up"],
        "explanation": "Horror films typically use unstable camera work (handheld) and intimate shots (extreme close-ups) to create anxiety."
    },
    3: {
        "id": 3,
        "type": "match",
        "title": "Technique & Emotional Impact",
        "question": "Match each technique to the emotion it most effectively creates",
        "techniques": ["Dutch Angle", "Tracking Shot", "Low-Key Lighting", "Bird's Eye View"],
        "emotions": ["Disorientation", "Immersion", "Mystery", "Insignificance"],
        "correct_answers": {
            "Dutch Angle": "Disorientation",
            "Tracking Shot": "Immersion",
            "Low-Key Lighting": "Mystery",
            "Bird's Eye View": "Insignificance"
        },
        "explanation": "Each technique creates a specific psychological effect. Dutch angles disorient, tracking shots immerse, etc."
    },
    4: {
        "id": 4,
        "type": "match",
        "title": "Lens Choice & Visual Effect",
        "question": "Match each lens type with its primary visual effect",
        "techniques": ["Wide Angle Lens", "Telephoto Lens", "Macro Lens", "Tilt-Shift Lens"],
        "emotions": ["Spatial Distortion", "Compression", "Extreme Detail", "Miniaturization"],
        "correct_answers": {
            "Wide Angle Lens": "Spatial Distortion",
            "Telephoto Lens": "Compression",
            "Macro Lens": "Extreme Detail",
            "Tilt-Shift Lens": "Miniaturization"
        },
        "explanation": "Each lens has distinctive effects: wide angles distort space, telephotos compress, etc."
    },
    5: {
        "id": 5,
        "type": "scenario",
        "title": "Best Technique Selection",
        "question": "A director wants to show a character suddenly realizing they've been betrayed. Which technique would best capture this moment of realization?",
        "options": ["Dolly Zoom", "Slow Motion", "Dutch Angle", "Static Wide Shot"],
        "correct_answer": "Dolly Zoom",
        "explanation": "The dolly zoom creates a disorienting effect that perfectly captures a moment of shocking realization."
    },
    6: {
        "id": 6,
        "type": "scenario",
        "title": "Establishing Atmosphere",
        "question": "A horror film director wants to establish a sense of isolation and vulnerability for a character alone in a large mansion. Which technique would be most effective?",
        "options": ["Extreme Close-Up", "Extreme Wide Shot", "Eye-Level Medium Shot", "Whip Pan"],
        "correct_answer": "Extreme Wide Shot",
        "explanation": "An extreme wide shot makes the character appear small and vulnerable within the vast, empty space."
    },
    7: {
        "id": 7,
        "type": "analysis",
        "title": "Film Scene Analysis",
        "question": "Watch the clip and identify which techniques are used at different points in the scene",
        "media": {"type": "video", "src": "/static/video/complex.mp4"},
        "options": ["Dutch Angle", "Tracking Shot", "Low-Key Lighting", "Handheld Camera", "Rack Focus"],
        "correct_answers": ["Dutch Angle", "Tracking Shot", "Low-Key Lighting"],
        "explanation": "The scene features a Dutch angle at the start, followed by a tracking shot, with low-key lighting throughout."
    },
    8: {
        "id": 8,
        "type": "analysis",
        "title": "Advanced Scene Breakdown",
        "question": "Analyze this scene and identify the techniques used",
        "media": {"type": "video", "src": "/static/video/shining.mp4"},
        "options": ["Steadicam Shot", "Symmetrical Framing", "Low Angle", "Dutch Angle", "Whip Pan"],
        "correct_answers": ["Steadicam Shot", "Symmetrical Framing", "Low Angle"],
        "explanation": "The scene features a steadicam shot, symmetrical framing, and low angles to create unease."
    }
}

# ─── Quiz Routes ──────────────────────────
@app.get("/quiz", response_class=HTMLResponse)
async def quiz_redirect():
    # Redirect to the first question when accessing /quiz
    return RedirectResponse(url="/quiz/1", status_code=302)

@app.get("/reset-quiz", response_class=HTMLResponse)
async def reset_quiz(request: Request):
    # Reset quiz progress in session
    session = request.state.session
    if "quiz_progress" in session:
        session["quiz_progress"] = {}
    if "quiz_submitted" in session:
        session["quiz_submitted"] = {}
    
    # Redirect to the first question
    return RedirectResponse(url="/quiz/1", status_code=302)

@app.get("/quiz/results", response_class=HTMLResponse, name="quiz_results")
async def quiz_results(request: Request):
    # Get quiz progress from session
    session = request.state.session
    quiz_progress = session.get("quiz_progress", {})
    
    # Calculate score and prepare results
    total_questions = len(QUIZ_DATA)
    score = 0
    questions = []
    categories = {
        "Identification": {"correct": 0, "total": 0},
        "Matching": {"correct": 0, "total": 0},
        "Analysis": {"correct": 0, "total": 0},
        "Scenario": {"correct": 0, "total": 0}
    }
    
    for q_id, question in QUIZ_DATA.items():
        q_id_str = str(q_id)
        user_answer = quiz_progress.get(q_id_str)
        is_correct = False
        
        # Determine category
        category = {
            "identify": "Identification",
            "match": "Matching",
            "analysis": "Analysis",
            "scenario": "Scenario"
        }[question["type"]]
        
        # Update category total
        categories[category]["total"] += 1
        
        if user_answer is not None:  # Only check if user provided an answer
            if question["type"] == "scenario":
                is_correct = user_answer == question["correct_answer"]
            elif question["type"] == "match":
                # Compare dictionaries by their contents
                is_correct = (
                    set(user_answer.keys()) == set(question["correct_answers"].keys()) and
                    all(user_answer[k] == question["correct_answers"][k] for k in user_answer)
                )
            else:  # identify or analysis
                is_correct = set(user_answer) == set(question["correct_answers"])
            
            # Update score if correct
            if is_correct:
                score += 1
                categories[category]["correct"] += 1
        
        # Add question details
        questions.append({
            "number": q_id,
            "title": question["title"],
            "type": question["type"],
            "correct": is_correct,
            "user_answer": "No answer provided" if user_answer is None else user_answer,
            "correct_answer": question.get("correct_answers", question.get("correct_answer")),
            "explanation": question["explanation"]
        })
    
    # Calculate category percentages and ensure all categories are included
    category_results = []
    for name, stats in categories.items():
        if stats["total"] > 0:  # Only include categories that have questions
            percentage = round((stats["correct"] / stats["total"]) * 100)
            category_results.append({
                "name": name,
                "correct": stats["correct"],
                "total": stats["total"],
                "percentage": percentage
            })
    
    return templates.TemplateResponse(
        "quiz_results.html",
        {
            "request": request,
            "score": score,
            "total": total_questions,
            "questions": questions,
            "categories": category_results
        }
    )

@app.get("/quiz/{question_id}", response_class=HTMLResponse)
async def quiz_question(request: Request, question_id: int):
    # Get quiz progress from session
    session = request.state.session
    quiz_progress = session.get("quiz_progress", {})
    quiz_submitted = session.get("quiz_submitted", {})  # Get submission state
    
    # Get the question data
    question = QUIZ_DATA.get(question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Get saved answer if it exists
    saved_answer = quiz_progress.get(str(question_id))
    
    # Check if this question has been submitted
    is_submitted = quiz_submitted.get(str(question_id), False)
    
    # Add correct answer reference
    if question["type"] == "identify":
        question["correct_answer_reference"] = {
            "correct": question["correct_answers"],
            "incorrect": [opt for opt in question["options"] if opt not in question["correct_answers"]]
        }
    elif question["type"] == "match":
        question["correct_answer_reference"] = question["correct_answers"]
    elif question["type"] == "scenario":
        question["correct_answer_reference"] = question["correct_answer"]
    
    # Print saved answer for debugging
    print(f"Saved answer for question {question_id}: {saved_answer}")
    print(f"Submission state for question {question_id}: {is_submitted}")
    
    return templates.TemplateResponse(
        "quiz_question.html",
        {
            "request": request,
            "question": question,
            "saved_answer": saved_answer,
            "total_questions": len(QUIZ_DATA),
            "current_question": question_id,
            "quiz_progress": quiz_progress,  # Ensure this is always a dict
            "session": session  # Pass the entire session to the template
        }
    )

# Save Progress Endpoint
@app.post("/save_progress")
async def save_progress(request: Request):
    data = await request.json()
    new_answers = data.get("answers") or {}
    is_submitted = data.get("submitted", False)  # Get submitted flag

    # Merge into session so progress is { "1": [...], "2": [...], ... }
    session = request.state.session
    prog = session.get("quiz_progress", {})
    submit_state = session.get("quiz_submitted", {})  # Get quiz submission state
    
    # ensure keys are strings
    for qid_str, ans in new_answers.items():
        if ans is None:
            # If null/None, remove the answer
            if str(qid_str) in prog:
                del prog[str(qid_str)]
            # Also remove submission state
            if str(qid_str) in submit_state:
                del submit_state[str(qid_str)]
        else:
            # Otherwise set the answer
            prog[str(qid_str)] = ans
            
            # Update submission state if this is a real submission
            if is_submitted:
                submit_state[str(qid_str)] = True
            
    session["quiz_progress"] = prog
    session["quiz_submitted"] = submit_state  # Save submission state to session

    # If there's at least one new answer, return its correctness flag;
    # otherwise just acknowledge the save.
    if new_answers:
        # unpack the single question submission
        qid_str, user_ans = next(iter(new_answers.items()))
        
        # If the answer is null, just acknowledge
        if user_ans is None:
            return {"status": "success", "reset": True}
            
        qid = int(qid_str)
        question = QUIZ_DATA[qid]

        if question["type"] in ("identify", "analysis"):
            is_correct = set(user_ans) == set(question["correct_answers"])
        elif question["type"] == "match":
            is_correct = user_ans == question["correct_answers"]
        else:  # scenario
            is_correct = user_ans == question["correct_answer"]

        return {"status": "success", "isCorrect": is_correct, "submitted": is_submitted}

    return {"status": "success"}


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
