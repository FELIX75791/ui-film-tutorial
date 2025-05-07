# ui-film-tutorial
# YouTuBe Video DEMO: 
[v2-may6] https://youtu.be/4ngeZgsfGc0
https://youtu.be/I0wPwVxinI4
Team Members: Ziyue Jin, Ken Deng, Linlin Zhang, Cheng Yang

TA: Phoebe Wang

# Essential Cinematography Techniques Tutorial

This Flask application provides an interactive learning experience for mastering essential cinematography techniques. Users can explore different categories of techniques and test their knowledge with an interactive quiz.

## Features

- Interactive learning modules for various cinematography techniques:
  - Camera Angles & Movement
  - Shot Types & Framing
  - Editing & Transitions
  - Visual Storytelling Elements
- Interactive elements including sliders, buttons, and drag-and-drop interfaces
- Knowledge quiz with multiple question types (identification, matching, best choice)
- User progress tracking
- Learning roadmap and navigation

## Project Structure

```
cinematography-app/
│
├── server.py                 # Main Flask application
├── requirements.txt       # Dependencies
│
├── static/                # Static files
│   ├── css/               # CSS stylesheets
│   ├── js/                # JavaScript files
│   ├── images/            # Image assets
│   └── videos/            # Video assets
│
├── templates/             # HTML templates
│   ├── base.html          # Base template
│   ├── home.html          # Home page
│   └── ...                # Other page templates
│
└── data/                  # User data storage (created at runtime) //Temp
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/FELIX75791/ui-film-tutorial.git
cd ui-film-tutorial
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python server.py
```

5. Open your web browser and navigate to:
```
http://127.0.0.1:8000/
```

## Group Members and Responsibilities

- Ziyue Jin, Ken Deng: Frontend development (HTML, CSS, JavaScript) & Backend development (Flask routes, data handling)
- Cheng Yang, Linlin Zhang: Content creation and quiz implementation & Design and testing

## Assignment Requirements Met (HW10-Main Apr23)

1. Backend implementation with Flask
2. Frontend using HTML/JS/jQuery/Bootstrap
3. User choice storage on each page
4. Quiz implementation with user response tracking
5. Data modularity using JSON objects instead of hardcoded content
6. Routes defined for all required pages
7. Complete navigation flow from home to final quiz result

## Acknowledgements

This project was developed as an assignment for 4170 UI-Design at Columbia University.

## Reference 
**Correct Answers for Each Question:**

1. **Question 1: Identify Cinematography Techniques**
   - Correct answers: "Dutch Angle" and "Low-Key Lighting"
   - Incorrect: "Tracking Shot" and "Depth of Field"

2. **Question 2: Horror Film Techniques**
   - Correct answers: "Handheld Camera" and "Extreme Close-Up"
   - Incorrect: "High-Key Lighting" and "Slow Motion"

3. **Question 3: Technique & Emotional Impact (Matching)**
   - Correct matches:
     - Dutch Angle → Disorientation
     - Tracking Shot → Immersion
     - Low-Key Lighting → Mystery
     - Bird's Eye View → Insignificance

4. **Question 4: Lens Choice & Visual Effect (Matching)**
   - Correct matches:
     - Wide Angle Lens → Spatial Distortion
     - Telephoto Lens → Compression
     - Macro Lens → Extreme Detail
     - Tilt-Shift Lens → Miniaturization

5. **Question 5: Best Technique Selection**
   - Correct answer: "Dolly Zoom"
   - Incorrect: "Slow Motion", "Dutch Angle", "Static Wide Shot"

6. **Question 6: Establishing Atmosphere**
   - Correct answer: "Extreme Wide Shot"
   - Incorrect: "Extreme Close-Up", "Eye-Level Medium Shot", "Whip Pan"

7. **Question 7: Film Scene Analysis**
   - Correct answers: "Dutch Angle", "Tracking Shot", "Low-Key Lighting"
   - Incorrect: "Handheld Camera", "Rack Focus"
  
PS. **`/static/video/complex.mp4` - Used for Question 7 (Film Scene Analysis):**
   - **Purpose:** This video should be suitable for analyzing various cinematographic techniques. It should include a range of camera movements, lighting setups, and framing styles that can be discussed in terms of their impact on storytelling and visual style.
   - **Suggestions:**
     - Look for a scene that includes dynamic camera work, such as tracking shots, dolly zooms, or complex camera movements.
     - The scene should have varied lighting conditions, such as low-key lighting or high contrast, to discuss mood and atmosphere.
     - Consider a scene from a film known for its innovative cinematography, like "Inception" or "Birdman."
Temp Source: https://www.youtube.com/watch?v=X-KDt-G1pJ0


8. **Question 8: Advanced Scene Breakdown**
   - Correct answers: "Steadicam Shot", "Symmetrical Framing", "Low Angle"
   - Incorrect: "Dutch Angle", "Whip Pan"

PS. **`/static/video/shining.mp4` - Used for Question 8 (Advanced Scene Breakdown):**
   - **Purpose:** This video should be suitable for a detailed breakdown of advanced cinematographic techniques. It should include elements like framing, camera angles, and movement that are more sophisticated or unconventional.
   - **Suggestions:**
     - Choose a scene that features unique or iconic camera angles, such as low angles, high angles, or Dutch angles.
     - The scene should have a strong visual style, possibly with symmetrical framing or a distinctive color palette.
     - Consider a scene from a film known for its visual storytelling, like "The Shining" (which the filename suggests) or "2001: A Space Odyssey."
Temp Source: https://www.youtube.com/watch?v=F2lU8PnA24A

# UI Film Tutorial Quiz

A web-based quiz application for learning about film techniques and cinematography.

## Setup

1. Make sure you have Python 3.8+ installed on your system.

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Make sure your virtual environment is activated.

2. Start the server:
   ```bash
   python server.py
   ```

3. Open your web browser and navigate to:
   ```
   http://127.0.0.1:8000/quiz
   ```

## Project Structure

- `server.py` - Main FastAPI server application
- `templates/` - HTML templates
- `static/` - Static files (CSS, JavaScript, images)
- `requirements.txt` - Python package dependencies


# May6 note
If just download the .zip; could try run these to launch the website
https://drive.google.com/file/d/1OwZvMRM6LYFBS9JchVHs-HgZylckpmej/view?usp=drive_link
- pip install fastapi uvicorn
- source venv/bin/activate && pip install fastapi uvicorn
- ./venv/bin/pip install fastapi uvicorn
- rm -rf venv && python3 -m venv venv && source venv/bin/activate && pip install fastapi uvicorn
- pip install jinja2
- python server.py
