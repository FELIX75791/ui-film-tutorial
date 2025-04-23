# ui-film-tutorial
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
├── app.py                 # Main Flask application
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
└── data/                  # User data storage (created at runtime)
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cinematography-tutorial.git
cd cinematography-tutorial
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
python app.py
```

5. Open your web browser and navigate to:
```
http://127.0.0.1:8000/
```

## Populating with Media

Before running the application, make sure to populate the static directory with necessary images and videos:

1. Create the following directories:
```bash
mkdir -p static/images static/videos
```

2. Add image files with relevant names as referenced in the JavaScript files:
   - `camera_angles.jpg`
   - `shot_types.jpg`
   - `editing.jpg`
   - `visual_storytelling.jpg`
   - `dutch_angles.jpg`
   - `low_angle.jpg`
   - `eye_level.jpg`
   - `high_angle.jpg`
   etc.

3. Add video files:
   - `dissolve.mp4`
   - `fade_in.mp4`
   - `fade_out.mp4`
   etc.

## Group Members and Responsibilities

- [Member 1]: Frontend development (HTML, CSS, JavaScript)
- [Member 2]: Backend development (Flask routes, data handling)
- [Member 3]: Content creation and quiz implementation
- [Member 4]: Design and testing

## Assignment Requirements Met

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
Source: https://www.youtube.com/watch?v=X-KDt-G1pJ0


8. **Question 8: Advanced Scene Breakdown**
   - Correct answers: "Steadicam Shot", "Symmetrical Framing", "Low Angle"
   - Incorrect: "Dutch Angle", "Whip Pan"

PS. **`/static/video/shining.mp4` - Used for Question 8 (Advanced Scene Breakdown):**
   - **Purpose:** This video should be suitable for a detailed breakdown of advanced cinematographic techniques. It should include elements like framing, camera angles, and movement that are more sophisticated or unconventional.
   - **Suggestions:**
     - Choose a scene that features unique or iconic camera angles, such as low angles, high angles, or Dutch angles.
     - The scene should have a strong visual style, possibly with symmetrical framing or a distinctive color palette.
     - Consider a scene from a film known for its visual storytelling, like "The Shining" (which the filename suggests) or "2001: A Space Odyssey."
Source: https://www.youtube.com/watch?v=F2lU8PnA24A

