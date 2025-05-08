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
        print(f"Created new session ID: {session_id}")
    else:
        print(f"Using existing session ID: {session_id}")
    
    # Get session data from in-memory store instead of cookie
    session = SESSION_STORE.get(session_id, {})
    
    # Check if question 1 state exists
    q1_answer = session.get("quiz_progress", {}).get("1")
    q1_submitted = session.get("quiz_submitted", {}).get("1", False)
    print(f"Session middleware - Q1 state: answer={q1_answer}, submitted={q1_submitted}")
    
    # Store session in request state
    request.state.session = session
    
    # Process request
    response = await call_next(request)
    
    # Get updated session from state (will have changes from route handlers)
    updated_session = request.state.session
    
    # Save session back to in-memory store
    SESSION_STORE[session_id] = updated_session
    
    # Check if question 1 state changed
    updated_q1_answer = updated_session.get("quiz_progress", {}).get("1")
    updated_q1_submitted = updated_session.get("quiz_submitted", {}).get("1", False)
    
    if q1_answer != updated_q1_answer or q1_submitted != updated_q1_submitted:
        print(f"Q1 state changed: {q1_answer} → {updated_q1_answer}, submitted: {q1_submitted} → {updated_q1_submitted}")
    
    # Save only the session_id to cookie
    if isinstance(response, Response):
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=86400 * 30  # 30 days for better persistence
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
    # Reset quiz progress in session but preserve question 1
    session = request.state.session
    
    # Save question 1 state before resetting
    q1_answer = None
    q1_submitted = False
    
    if "quiz_progress" in session:
        q1_answer = session["quiz_progress"].get("1")
        if "quiz_submitted" in session:
            q1_submitted = session["quiz_submitted"].get("1", False)
            
        # Reset progress except for question 1
        quiz_progress = {}
        if q1_answer is not None:
            quiz_progress["1"] = q1_answer
        session["quiz_progress"] = quiz_progress
        
        # Reset submission state except for question 1
        quiz_submitted = {}
        if q1_submitted:
            quiz_submitted["1"] = True
        session["quiz_submitted"] = quiz_submitted
    
    # Print debug info
    print(f"After reset - Preserving Q1 answer: {q1_answer}, submitted: {q1_submitted}")
    
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
    session = request.state.session
    # Initialize progress if not exists but don't clear it if already present
    if "quiz_progress" not in session:
        session["quiz_progress"] = {}
    if "quiz_submitted" not in session:
        session["quiz_submitted"] = {}
        
    quiz_progress = session.get("quiz_progress", {})
    quiz_submitted = session.get("quiz_submitted", {})  # Get submission state
    
    # Get the question data
    question = QUIZ_DATA.get(question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Special handling for question 1 - always retrieve saved answer from session
    if question_id == 1:
        saved_answer = quiz_progress.get("1")
        is_submitted = quiz_submitted.get("1", False)
        print(f"Accessing question 1 - Saved answer: {saved_answer}, Submitted: {is_submitted}")
        
        # If we have a session_id cookie but no saved answer, check SESSION_STORE directly
        if saved_answer is None and request.cookies.get("session_id"):
            print("Attempt to recover question 1 answer from SESSION_STORE")
            session_id = request.cookies.get("session_id")
            alt_session = SESSION_STORE.get(session_id, {})
            if alt_session:
                saved_answer = alt_session.get("quiz_progress", {}).get("1")
                is_submitted = alt_session.get("quiz_submitted", {}).get("1", False)
                
                # Update session if found
                if saved_answer is not None:
                    print(f"Recovered answer from SESSION_STORE: {saved_answer}")
                    quiz_progress["1"] = saved_answer
                    if is_submitted:
                        quiz_submitted["1"] = True
                    
                    # Update the session
                    session["quiz_progress"] = quiz_progress
                    session["quiz_submitted"] = quiz_submitted
    else:
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
    print(f"Showing question {question_id} - Saved answer: {saved_answer}, Submitted: {is_submitted}")
    
    return templates.TemplateResponse(
        "quiz_question.html",
        {
            "request": request,
            "question": question,
            "saved_answer": saved_answer,
            "total_questions": len(QUIZ_DATA),
            "current_question": question_id,
            "quiz_progress": quiz_progress,
            "quiz_submitted": quiz_submitted,
            "is_submitted": is_submitted,
            "session": session  # Pass the entire session to the template
        }
    )

# Save Progress Endpoint
@app.post("/save_progress")
async def save_progress(request: Request):
    try:
        data = await request.json()
        new_answers = data.get("answers") or {}
        is_submitted = data.get("submitted", False)  # Get submitted flag

        # Merge into session so progress is { "1": [...], "2": [...], ... }
        session = request.state.session
        prog = session.get("quiz_progress", {})
        submit_state = session.get("quiz_submitted", {})  # Get quiz submission state
        
        print(f"Received save request - submitted: {is_submitted}, answers: {new_answers}")
        print(f"Before update - prog: {prog}, submit_state: {submit_state}")
        
        # ensure keys are strings and update values
        changed_questions = []
        for qid_str, ans in new_answers.items():
            qid_str = str(qid_str)  # Ensure string key
            changed_questions.append(qid_str)
            
            # Special logging for question 1
            if qid_str == "1":
                print(f"QUESTION 1 SAVE: Answer={ans}, Submitted={is_submitted}")
            
            if ans is None:
                # If null/None, remove the answer
                if qid_str in prog:
                    del prog[qid_str]
                # Also remove submission state
                if qid_str in submit_state:
                    del submit_state[qid_str]
            else:
                # Otherwise set the answer
                prog[qid_str] = ans
                
                # Update submission state if this is a real submission
                if is_submitted:
                    print(f"Marking question {qid_str} as submitted")
                    submit_state[qid_str] = True
        
        # Save the updated states back to the session
        session["quiz_progress"] = prog
        session["quiz_submitted"] = submit_state
        # Make sure the session is saved in the global store
        SESSION_STORE[request.cookies.get("session_id")] = session
        
        # Special verification for question 1
        if "1" in changed_questions:
            print(f"After saving Q1 - Quiz progress for Q1: {prog.get('1')}")
            print(f"After saving Q1 - Submit state for Q1: {submit_state.get('1')}")
        
        # Log current session state for debugging
        print(f"After update - prog: {prog}, submit_state: {submit_state}")

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
    except Exception as e:
        print(f"Error in save_progress: {e}")
        return {"status": "error", "message": str(e)}

# Add a debug endpoint for question 1
@app.get("/debug-q1")
async def debug_q1(request: Request):
    session = request.state.session
    quiz_progress = session.get("quiz_progress", {})
    quiz_submitted = session.get("quiz_submitted", {})
    
    q1_state = {
        "answer": quiz_progress.get("1"),
        "submitted": quiz_submitted.get("1", False),
        "session_id": request.cookies.get("session_id"),
        "all_progress": quiz_progress,
        "all_submissions": quiz_submitted
    }
    
    return q1_state

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
