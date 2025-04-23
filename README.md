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
http://127.0.0.1:5000/
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