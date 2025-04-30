/* linlinzhang */
/* 
 * Quiz Interactive Script
 * Handles quiz interactions and answer submission
 */
"use strict";

// Quiz Questions Data
const questions = [
    // Type 1: Identify techniques from clips (checkbox selection)
    {
        id: "q1",
        type: "identify",
        title: "Identify Cinematography Techniques",
        text: "Watch the clip and identify which cinematography techniques are being used (select all that apply)",
        media: { type: "image", src: "/static/img/dutch-angle.jpg" },
        options: ["Dutch Angle", "Low-Key Lighting", "Tracking Shot", "Depth of Field"],
        correctAnswers: ["Dutch Angle", "Low-Key Lighting"],
        feedback: {
            correct: "Correct! This scene uses Dutch Angle to create disorientation and Low-Key Lighting to build atmosphere.",
            incorrect: "Look for the tilted frame (Dutch Angle) and the dramatic shadows (Low-Key Lighting) that create the mood."
        }
    },
    {
        id: "q2",
        type: "identify",
        title: "Horror Film Techniques",
        text: "Identify which cinematography techniques are used in this horror scene (select all that apply)",
        media: { type: "image", src: "/static/img/horror-scene.jpg" },
        options: ["Handheld Camera", "High-Key Lighting", "Extreme Close-Up", "Slow Motion"],
        correctAnswers: ["Handheld Camera", "Extreme Close-Up"],
        feedback: {
            correct: "Excellent! The handheld camera creates unease while extreme close-ups intensify emotions.",
            incorrect: "Horror films typically use unstable camera work (handheld) and intimate shots (extreme close-ups) to create anxiety."
        }
    },
    
    // Type 2: Match techniques to emotions (drag and drop)
    {
        id: "q3",
        type: "match",
        title: "Technique & Emotional Impact",
        text: "Drag each technique to the emotion it most effectively creates",
        techniques: ["Dutch Angle", "Tracking Shot", "Low-Key Lighting", "Bird's Eye View"],
        emotions: ["Disorientation", "Immersion", "Mystery", "Insignificance"],
        correctMatches: {
            "Dutch Angle": "Disorientation",
            "Tracking Shot": "Immersion",
            "Low-Key Lighting": "Mystery",
            "Bird's Eye View": "Insignificance"
        },
        feedback: {
            correct: "Perfect match! You understand how these techniques influence audience emotions.",
            incorrect: "Remember, each technique creates a specific psychological effect. Dutch angles disorient, tracking shots immerse, etc."
        }
    },
    {
        id: "q4",
        type: "match",
        title: "Lens Choice & Visual Effect",
        text: "Match each lens type with its primary visual effect",
        techniques: ["Wide Angle Lens", "Telephoto Lens", "Macro Lens", "Tilt-Shift Lens"],
        emotions: ["Spatial Distortion", "Compression", "Extreme Detail", "Miniaturization"],
        correctMatches: {
            "Wide Angle Lens": "Spatial Distortion",
            "Telephoto Lens": "Compression",
            "Macro Lens": "Extreme Detail",
            "Tilt-Shift Lens": "Miniaturization"
        },
        feedback: {
            correct: "Excellent understanding of lens characteristics!",
            incorrect: "Each lens has distinctive effects: wide angles distort space, telephotos compress, etc."
        }
    },
    
    // Type A3: Select best technique for scenario (radio)
    {
        id: "q5",
        type: "scenario",
        title: "Best Technique Selection",
        text: "A director wants to show a character suddenly realizing they've been betrayed. Which technique would best capture this moment of realization?",
        options: [
            "Dolly Zoom",
            "Slow Motion",
            "Dutch Angle",
            "Static Wide Shot"
        ],
        correctAnswer: "Dolly Zoom",
        feedback: {
            correct: "Correct! The dolly zoom (pushing in while zooming out) creates a disorienting effect that perfectly captures a moment of shocking realization.",
            incorrect: "The dolly zoom (famously used in 'Jaws' and 'Vertigo') creates a disorienting effect where the subject stays the same size while the background warps, perfect for moments of revelation."
        }
    },
    {
        id: "q6",
        type: "scenario",
        title: "Establishing Atmosphere",
        text: "A horror film director wants to establish a sense of isolation and vulnerability for a character alone in a large mansion. Which technique would be most effective?",
        options: [
            "Extreme Close-Up",
            "Extreme Wide Shot",
            "Eye-Level Medium Shot",
            "Whip Pan"
        ],
        correctAnswer: "Extreme Wide Shot",
        feedback: {
            correct: "Perfect choice! An extreme wide shot makes the character appear small and vulnerable within the vast, empty space.",
            incorrect: "An extreme wide shot would be most effective here, as it would make the character appear small and isolated within the large environment."
        }
    },
    
    // Type 4: Scene analysis with multiple techniques (checkbox with timeline)
    {
        id: "q7",
        type: "analysis",
        title: "Film Scene Analysis",
        text: "Watch the clip and identify which techniques are used at different points in the scene",
        media: { type: "video", src: "/static/video/complex.mp4" },
        timecodes: [
            {time: "0:05", technique: "Dutch Angle"},
            {time: "0:15", technique: "Tracking Shot"},
            {time: "0:28", technique: "Low-Key Lighting"}
        ],
        options: ["Dutch Angle", "Tracking Shot", "Low-Key Lighting", "Handheld Camera", "Rack Focus"],
        correctAnswers: ["Dutch Angle", "Tracking Shot", "Low-Key Lighting"],
        feedback: {
            correct: "Excellent analysis! You correctly identified all the techniques used in this complex scene.",
            incorrect: "In this scene, there's a Dutch angle at 0:05, a tracking shot at 0:15, and low-key lighting throughout."
        }
    },
    {
        id: "q8",
        type: "analysis",
        title: "Advanced Scene Breakdown",
        text: "Analyze this scene from 'The Shining' and identify the techniques used at specific timestamps",
        media: { type: "video", src: "/static/video/shining.mp4" },
        timecodes: [
            {time: "0:03", technique: "Steadicam Shot"},
            {time: "0:18", technique: "Symmetrical Framing"},
            {time: "0:32", technique: "Low Angle"}
        ],
        options: ["Steadicam Shot", "Symmetrical Framing", "Low Angle", "Dutch Angle", "Whip Pan"],
        correctAnswers: ["Steadicam Shot", "Symmetrical Framing", "Low Angle"],
        feedback: {
            correct: "Perfect analysis! Stanley Kubrick used these techniques masterfully to create the film's unsettling atmosphere.",
            incorrect: "The scene features Kubrick's famous steadicam shot, symmetrical framing, and low angles to create unease."
        }
    }
];

// Quiz state management
let currentQuestionId = 1;
let userAnswers = {};
let score = 0;

// DOM Elements
const quizIntro = document.getElementById('quiz-intro');
const quizQuestion = document.getElementById('quiz-question');
const quizResults = document.getElementById('quiz-results');
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const questionMedia = document.getElementById('question-media');
const questionForm = document.getElementById('question-form');
const optionsContainer = document.getElementById('options-container');
const matchExercise = document.getElementById('match-exercise');
const techList = document.getElementById('tech-list');
const emoList = document.getElementById('emo-list');
const feedback = document.getElementById('feedback');

// Initialize Quiz
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz script loaded');

    // Get quiz state from template
    const quizState = window.QUIZ_STATE || {};
    currentQuestionId = quizState.currentQuestion || 1;
    userAnswers = (quizState.progress && quizState.progress.answers) || {};
    
    // Get all necessary elements after DOM is loaded
    const quizIntro = document.getElementById('quiz-intro');
    const quizQuestion = document.getElementById('quiz-question');
    const quizResults = document.getElementById('quiz-results');
    
    // Check if quiz elements exist (we might be on a different page)
    if (!quizIntro) return console.log("Quiz intro not found");
    
    // Button Event Listeners
    document.getElementById('begin-btn')?.addEventListener('click', startQuiz);
    document.getElementById('review-btn')?.addEventListener('click', () => window.location.href = '/overview');
    
    // Add click events to the submit and navigation buttons
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const feedbackDiv = document.getElementById('feedback');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get selected answers based on question type
            let answers;
            const quizContent = document.querySelector('.quiz-content');
            const questionType = quizContent.getAttribute('data-question-type');
            
            if (questionType === 'scenario') {
                const selectedRadio = document.querySelector('input[type="radio"]:checked');
                answers = selectedRadio ? selectedRadio.value : null;
            } else if (questionType === 'identify') {
                const selectedCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => cb.value);
                answers = selectedCheckboxes;
            } else if (questionType === 'match') {
                const matches = {};
                document.querySelectorAll('.matching-pair').forEach(pair => {
                    const tech = pair.querySelector('.technique').textContent;
                    const emotion = pair.querySelector('select').value;
                    if (emotion) {
                        matches[tech] = emotion;
                    }
                });
                answers = matches;
            }
            
            // Save the answer
            saveAnswer(answers);
            
            // Show feedback
            showFeedback(answers);
        });
    }
    
    if (nextBtn) {
        // Initially hide the next button
        nextBtn.style.display = 'none';
        
        nextBtn.addEventListener('click', function() {
            const nextQuestionId = currentQuestionId + 1;
            if (nextQuestionId <= questions.length) {
                window.location.href = `/quiz/${nextQuestionId}`;
            } else {
                window.location.href = '/quiz/results';
            }
        });
    }
    
    // Results page buttons
    document.getElementById('review-missed-btn')?.addEventListener('click', reviewMissedQuestions);
    document.getElementById('return-btn')?.addEventListener('click', () => window.location.href = '/overview');
    document.getElementById('complete-btn')?.addEventListener('click', () => window.location.href = '/contact');
    
    // Start with the first question if not on intro page
    if (quizQuestion && !quizQuestion.classList.contains('hidden')) {
        showQuestion(currentQuestionId - 1);
    }
    
    // Initialize drag and drop if we're on a matching question
    initializeDragAndDrop();
    
    // Load saved answers from session on page load
    const pathParts = window.location.pathname.split('/');
    currentQuestionId = parseInt(pathParts[pathParts.length - 1]) || 1;
    
    // Get quiz progress from the template
    const quizProgressElement = document.getElementById('quiz-progress');
    if (quizProgressElement) {
        try {
            const quizProgress = JSON.parse(quizProgressElement.textContent);
            userAnswers = quizProgress.answers || {};
            
            // Restore saved answers for current question
            restoreSavedAnswers();
        } catch (e) {
            console.error("Error loading quiz progress:", e);
        }
    }
});

function startQuiz() {
    currentQuestionId = 1;
    userAnswers = {};
    score = 0;
    showQuestion(currentQuestionId - 1);
}

function showQuestion(index) {
    const question = questions[index];
    if (!question) return console.error("Question not found:", index);
    
    // Hide all sections and show question section
    if (quizIntro) quizIntro.classList.add('hidden');
    if (quizResults) quizResults.classList.add('hidden');
    if (quizQuestion) quizQuestion.classList.remove('hidden');
    if (feedback) feedback.classList.add('hidden');
    
    // Set question content
    if (questionTitle) questionTitle.textContent = question.title;
    if (questionText) questionText.textContent = question.text;
    
    // Handle media if present
    if (questionMedia && question.media) {
        if (question.media.type === 'image') {
            questionMedia.innerHTML = `<img src="${question.media.src}" alt="Quiz Question" style="width: 100px;">`;
        } else {
            // Add a fallback image if video is not available
            questionMedia.innerHTML = `
                <video src="${question.media.src}" controls onerror="this.outerHTML='<img src=\'fallback-video.jpg/static/img/fallback-video.jpg\' alt=\'Video not available\'>'"></video>
            `;
        }
        questionMedia.classList.remove('hidden');
    } else if (questionMedia) {
        questionMedia.innerHTML = '';
        questionMedia.classList.add('hidden');
    }
    
    // Render question based on type
    if (optionsContainer) {
        renderQuestionType(question);
    }
    
    // Update navigation buttons
    if (backBtn) backBtn.disabled = index === 0;
    if (nextBtn) nextBtn.classList.add('hidden');
    if (submitBtn) submitBtn.classList.remove('hidden');
}

function renderQuestionType(question) {
    // Clear previous content
    optionsContainer.innerHTML = '';
    
    switch(question.type) {
        case 'identify':
        case 'analysis':
            renderCheckboxOptions(question);
            break;
        case 'match':
            renderMatchingExercise(question);
            break;
        case 'scenario':
            renderRadioOptions(question);
            break;
    }
}

function renderCheckboxOptions(question) {
    const form = document.createElement('form');
    form.id = 'question-form';
    form.className = 'quiz-form';
    
    if (question.type === 'analysis' && question.timecodes) {
        // Add timecode information for analysis questions
        const timecodeInfo = document.createElement('div');
        timecodeInfo.className = 'timecode-info';
        timecodeInfo.innerHTML = '<h4>Look for these techniques at:</h4>';
        
        const timeList = document.createElement('ul');
        question.timecodes.forEach(tc => {
            const item = document.createElement('li');
            item.textContent = `${tc.time} - ?`;
            timeList.appendChild(item);
        });
        
        timecodeInfo.appendChild(timeList);
        form.appendChild(timecodeInfo);
    }
    
    question.options.forEach(option => {
        const label = document.createElement('label');
        label.className = 'checkbox-option';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = question.id;
        input.value = option;
        
        if (userAnswers[question.id]) {
            input.checked = userAnswers[question.id].includes(option);
        }
        
        const span = document.createElement('span');
        span.textContent = option;
        
        label.appendChild(input);
        label.appendChild(span);
        form.appendChild(label);
    });
    
    optionsContainer.appendChild(form);
}

function renderRadioOptions(question) {
    const form = document.createElement('form');
    form.id = 'question-form';
    form.className = 'quiz-form';
    
    question.options.forEach(option => {
        const label = document.createElement('label');
        label.className = 'radio-option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = question.id;
        input.value = option;
        
        if (userAnswers[question.id]) {
            input.checked = userAnswers[question.id] === option;
        }
        
        const span = document.createElement('span');
        span.textContent = option;
        
        label.appendChild(input);
        label.appendChild(span);
        form.appendChild(label);
    });
    
    optionsContainer.appendChild(form);
}

function renderMatchingExercise(question) {
    const matchContainer = document.createElement('div');
    matchContainer.className = 'match-container';
    
    // Techniques column
    const techColumn = document.createElement('div');
    techColumn.className = 'match-column';
    techColumn.innerHTML = '<h3>Techniques</h3>';
    
    const techList = document.createElement('ul');
    techList.id = 'tech-list';
    techList.className = 'sortable-list';
    
    question.techniques.forEach(tech => {
        const item = document.createElement('li');
        item.className = 'tech-item';
        item.setAttribute('draggable', 'true');
        item.setAttribute('data-technique', tech);
        item.textContent = tech;
        techList.appendChild(item);
    });
    
    techColumn.appendChild(techList);
    
    // Emotions column
    const emoColumn = document.createElement('div');
    emoColumn.className = 'match-column';
    emoColumn.innerHTML = '<h3>Effects</h3>';
    
    const emoList = document.createElement('div');
    emoList.id = 'emo-list';
    
    question.emotions.forEach(emo => {
        const box = document.createElement('div');
        box.className = 'emo-box';
        box.setAttribute('data-emotion', emo);
        box.textContent = emo;
        emoList.appendChild(box);
    });
    
    emoColumn.appendChild(emoList);
    
    // Add columns to container
    matchContainer.appendChild(techColumn);
    matchContainer.appendChild(emoColumn);
    
    optionsContainer.appendChild(matchContainer);
    
    // Initialize drag and drop
    initializeDragAndDrop();
}

function initializeDragAndDrop() {
    const techItems = document.querySelectorAll('.technique-item');
    const emoBoxes = document.querySelectorAll('.emotion-box');
    
    if (!techItems.length || !emoBoxes.length) return;
    
    let draggedItem = null;
    
    techItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedItem = this;
            setTimeout(() => this.classList.add('dragging'), 0);
            e.dataTransfer.setData('text/plain', '');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    emoBoxes.forEach(box => {
        box.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        box.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        box.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedItem) {
                // Remove from previous location if already placed
                const parent = draggedItem.parentNode;
                if (parent.classList.contains('emotion-box')) {
                    parent.removeAttribute('data-matched');
                }
                
                // Add to new location
                this.appendChild(draggedItem);
                this.setAttribute('data-matched', draggedItem.getAttribute('data-technique'));
            }
        });
    });
}

function submitAnswer() {
    console.log("Submitting answer");
    const question = questions[currentQuestionId - 1];
    if (!question) return console.error("Question not found on submit");
    
    let isCorrect = false;
    let userAnswer;
    
    // Get answers based on question type
    switch (question.type) {
        case 'identify':
        case 'analysis':
            userAnswer = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(input => input.value);
            isCorrect = arraysEqual(userAnswer.sort(), question.correctAnswers.sort());
            break;
            
        case 'scenario':
            userAnswer = document.querySelector('input[type="radio"]:checked')?.value;
            isCorrect = userAnswer === question.correctAnswer;
            break;
            
        case 'match':
            userAnswer = {};
            document.querySelectorAll('.emotion-box').forEach(box => {
                const technique = box.getAttribute('data-matched');
                const emotion = box.getAttribute('data-emotion');
                if (technique) {
                    userAnswer[technique] = emotion;
                }
            });
            
            const allMatched = question.techniques.every(tech => userAnswer[tech] !== undefined);
            const allCorrect = Object.entries(userAnswer).every(([tech, emotion]) => 
                question.correctMatches[tech] === emotion
            );
            
            isCorrect = allMatched && allCorrect;
            break;
    }
    
    // Save progress to server
    const progressData = {
        currentQuestion: currentQuestionId,
        answers: {
            [question.id]: userAnswer
        }
    };
    
    fetch('/save_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save progress');
        }
        return response.json();
    })
    .then(data => {
        showFeedback(isCorrect, question);
        
        // Show next button after successful submission
        const submitBtn = document.getElementById('submit-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (submitBtn) {
            submitBtn.style.display = 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }
    })
    .catch(error => {
        console.error('Error saving progress:', error);
        alert('Failed to save your answer. Please try again.');
    });
}

function showFeedback(isCorrect, question) {
    console.log("Showing feedback:", isCorrect ? "Correct" : "Incorrect");
    
    const feedbackDiv = document.getElementById('feedback');
    if (feedbackDiv) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = `
            <div class="quiz-feedback ${isCorrect ? 'success' : 'error'}">
                <h3>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h3>
                <p>${isCorrect ? question.feedback.correct : question.feedback.incorrect}</p>
            </div>
        `;
    }

    // Hide submit button and show next button
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
    
    if (nextBtn) {
        nextBtn.style.display = 'inline-block';
    }
}

function nextQuestion() {
    if (feedback) feedback.classList.add('hidden');
    
    if (currentQuestionId < questions.length) {
        currentQuestionId++;
        showQuestion(currentQuestionId - 1);
        
        // Reset UI state for the next question
        const submitBtn = document.querySelector('button[type="submit"], #submit-btn, .submit-answer');
        const nextBtn = document.getElementById('next-btn');
        
        if (submitBtn) submitBtn.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.add('hidden');
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestionId > 1) {
        currentQuestionId--;
        showQuestion(currentQuestionId - 1);
    } else {
        if (quizQuestion) quizQuestion.classList.add('hidden');
        if (quizIntro) quizIntro.classList.remove('hidden');
    }
}

function showResults() {
    if (quizQuestion) quizQuestion.classList.add('hidden');
    if (quizResults) quizResults.classList.remove('hidden');
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-container';
    
    // Score header
    const scoreHeader = document.createElement('h2');
    scoreHeader.textContent = `You scored ${score} out of ${questions.length}!`;
    resultsContainer.appendChild(scoreHeader);
    
    // Score percentage
    const percentage = Math.round((score / questions.length) * 100);
    const scorePercentage = document.createElement('p');
    scorePercentage.className = 'score-percentage';
    scorePercentage.textContent = `${percentage}% Complete`;
    resultsContainer.appendChild(scorePercentage);
    
    // Add category analysis
    const categoryAnalysis = document.createElement('div');
    categoryAnalysis.className = 'category-analysis';
    categoryAnalysis.innerHTML = '<h3>Analysis by Category</h3>';
    
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-container';
    
    // Calculate performance by question type
    const typePerformance = {
        'identify': { correct: 0, total: 0 },
        'match': { correct: 0, total: 0 },
        'scenario': { correct: 0, total: 0 },
        'analysis': { correct: 0, total: 0 }
    };
    
    questions.forEach(q => {
        if (!typePerformance[q.type]) return;
        
        typePerformance[q.type].total++;
        if (checkIfAnswerCorrect(q, userAnswers[q.id])) {
            typePerformance[q.type].correct++;
        }
    });
    
    // Display performance by question type
    const typeLables = {
        'identify': 'Technique Identification',
        'match': 'Technique-Emotion Matching',
        'scenario': 'Scenario Problem Solving',
        'analysis': 'Scene Analysis'
    };
    
    Object.entries(typePerformance).forEach(([type, data]) => {
        if (data.total === 0) return;
        
        const typePercent = Math.round((data.correct / data.total) * 100);
        const categoryBox = document.createElement('div');
        categoryBox.className = 'category-box';
        
        const categoryName = document.createElement('h4');
        categoryName.textContent = typeLables[type];
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${typePercent}%`;
        
        const scoreInfo = document.createElement('p');
        scoreInfo.textContent = `${data.correct}/${data.total} (${typePercent}%)`;
        
        progressBar.appendChild(progressFill);
        categoryBox.appendChild(categoryName);
        categoryBox.appendChild(progressBar);
        categoryBox.appendChild(scoreInfo);
        
        categoriesContainer.appendChild(categoryBox);
    });
    
    categoryAnalysis.appendChild(categoriesContainer);
    resultsContainer.appendChild(categoryAnalysis);
    
    // Results details
    const breakdown = document.createElement('div');
    breakdown.className = 'results-breakdown';
    breakdown.innerHTML = '<h3>Question-by-Question Breakdown</h3>';
    
    const questionList = document.createElement('ul');
    questionList.className = 'question-list';
    
    questions.forEach((q, index) => {
        const isCorrect = checkIfAnswerCorrect(q, userAnswers[q.id]);
        
        const item = document.createElement('li');
        item.className = `question-result ${isCorrect ? 'correct' : 'incorrect'}`;
        
        const questionNum = document.createElement('span');
        questionNum.className = 'question-number';
        questionNum.textContent = `Question ${index+1}: `;
        
        const questionDesc = document.createElement('span');
        questionDesc.className = 'question-desc';
        questionDesc.textContent = q.title;
        
        const resultIndicator = document.createElement('span');
        resultIndicator.className = 'result-indicator';
        resultIndicator.textContent = isCorrect ? '✓' : '✗';
        
        item.appendChild(questionNum);
        item.appendChild(questionDesc);
        item.appendChild(resultIndicator);
        
        questionList.appendChild(item);
    });
    
    breakdown.appendChild(questionList);
    resultsContainer.appendChild(breakdown);
    
    // Generate personalized recommendations
    const recommendations = [];
    
    // Find weakest area
    let weakestType = '';
    let lowestScore = 100;
    
    Object.entries(typePerformance).forEach(([type, data]) => {
        if (data.total === 0) return;
        
        const typePercent = Math.round((data.correct / data.total) * 100);
        if (typePercent < lowestScore) {
            lowestScore = typePercent;
            weakestType = type;
        }
    });
    
    // Add specific recommendations
    if (weakestType && lowestScore < 70) {
        switch(weakestType) {
            case 'identify':
                recommendations.push('Practice identifying cinematography techniques in films you watch.');
                recommendations.push('Review the visual examples in the tutorial section.');
                break;
            case 'match':
                recommendations.push('Study how different techniques create specific emotional responses.');
                recommendations.push('Try the matching exercises in the practice section.');
                break;
            case 'scenario':
                recommendations.push('Work on understanding which techniques are appropriate for specific storytelling needs.');
                recommendations.push('Analyze how directors choose techniques for particular dramatic moments.');
                break;
            case 'analysis':
                recommendations.push('Practice breaking down complex scenes into their component techniques.');
                recommendations.push('Study how techniques change throughout scenes to create meaning.');
                break;
        }
    }
    
    // Add general recommendations based on overall score
    if (percentage < 50) {
        recommendations.push('Review the fundamental concepts in the tutorial section.');
    } else if (percentage < 80) {
        recommendations.push('Watch some classic films with the techniques discussed in mind.');
    } else {
        recommendations.push('Great job! Consider exploring advanced cinematography concepts.');
    }
    
    // Display recommendations if any
    if (recommendations.length > 0) {
        const recSection = document.createElement('div');
        recSection.className = 'recommendations';
        recSection.innerHTML = '<h3>Recommendations</h3>';
        
        const recList = document.createElement('ul');
        recommendations.forEach(rec => {
            const item = document.createElement('li');
            item.textContent = rec;
            recList.appendChild(item);
        });
        
        recSection.appendChild(recList);
        resultsContainer.appendChild(recSection);
    }
    
    // Action buttons
    const actionBtns = document.createElement('div');
    actionBtns.className = 'result-actions';
    
    const reviewBtn = document.createElement('button');
    reviewBtn.id = 'review-missed-btn';
    reviewBtn.className = 'btn btn-secondary';
    reviewBtn.textContent = 'Review Missed Questions';
    reviewBtn.addEventListener('click', reviewMissedQuestions);
    
    const techBtn = document.createElement('button');
    techBtn.id = 'return-btn';
    techBtn.className = 'btn btn-secondary';
    techBtn.textContent = 'Return to Technique Sections';
    techBtn.addEventListener('click', () => window.location.href = '/overview');
    
    const completeBtn = document.createElement('button');
    completeBtn.id = 'complete-btn';
    completeBtn.className = 'btn btn-primary';
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', () => window.location.href = '/contact');
    
    actionBtns.appendChild(reviewBtn);
    actionBtns.appendChild(techBtn);
    actionBtns.appendChild(completeBtn);
    
    resultsContainer.appendChild(actionBtns);
    
    // Save final results to localStorage
    localStorage.setItem('quizResults', JSON.stringify({
        score: score,
        total: questions.length,
        percentage: percentage,
        answers: userAnswers,
        completed: true,
        date: new Date().toISOString()
    }));
    
    // Replace existing content
    if (quizResults) {
        quizResults.innerHTML = '';
        quizResults.appendChild(resultsContainer);
    }
}

function reviewMissedQuestions() {
    const missedIndex = questions.findIndex((q, index) => 
        !checkIfAnswerCorrect(q, userAnswers[q.id])
    );
    
    if (missedIndex !== -1) {
        currentQuestionId = missedIndex + 1;
        showQuestion(currentQuestionId - 1);
    }
}

function checkIfAnswerCorrect(question, answer) {
    if (!answer) return false;
    
    switch (question.type) {
        case 'identify':
        case 'analysis':
            return arraysEqual(answer.sort(), question.correctAnswers.sort());
            
        case 'scenario':
            return answer === question.correctAnswer;
            
        case 'match':
            return Object.entries(answer).length === question.techniques.length &&
                   Object.entries(answer).every(([tech, emotion]) => 
                       question.correctMatches[tech] === emotion
                   );
    }
    
    return false;
}

function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
}

function setupEventListeners() {
    // Submit button
    const submitBtn = document.querySelector('#submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleSubmit);
    }
    
    // Next button
    const nextBtn = document.querySelector('#next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const nextQuestionId = currentQuestionId + 1;
            if (nextQuestionId <= questions.length) {
                window.location.href = `/quiz/${nextQuestionId}`;
            } else {
                window.location.href = '/quiz/results';
            }
        });
    }
    
    // Back button
    const backBtn = document.querySelector('#back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const prevQuestionId = currentQuestionId - 1;
            if (prevQuestionId >= 1) {
                window.location.href = `/quiz/${prevQuestionId}`;
            }
        });
    }
}

function restoreSavedAnswers() {
    const quizProgress = window.QUIZ_STATE && window.QUIZ_STATE.progress;
    if (!quizProgress || !quizProgress.answers || !quizProgress.answers[currentQuestionId]) return;
    
    const savedAnswers = quizProgress.answers[currentQuestionId];
    const questionType = document.querySelector('.quiz-content').getAttribute('data-question-type');
    
    switch (questionType) {
        case 'identify':
        case 'analysis':
            if (Array.isArray(savedAnswers)) {
                savedAnswers.forEach(answer => {
                    const checkbox = document.querySelector(`input[value="${answer}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            break;
            
        case 'scenario':
            if (typeof savedAnswers === 'string') {
                const radio = document.querySelector(`input[value="${savedAnswers}"]`);
                if (radio) radio.checked = true;
            }
            break;
            
        case 'match':
            if (typeof savedAnswers === 'object') {
                Object.entries(savedAnswers).forEach(([technique, emotion]) => {
                    const techItem = document.querySelector(`[data-technique="${technique}"]`);
                    const emoBox = document.querySelector(`[data-emotion="${emotion}"]`);
                    if (techItem && emoBox) {
                        emoBox.appendChild(techItem);
                        emoBox.setAttribute('data-matched', technique);
                    }
                });
            }
            break;
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    console.log('Submit clicked');

    // Get the form
    const form = document.getElementById('question-form');
    if (!form) return;

    // Get selected answers
    const answers = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
        .map(input => input.value);

    console.log('Selected answers:', answers);

    // Save answers
    try {
        const response = await fetch('/save_progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answers: {
                    [currentQuestionId]: answers
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save progress');
        }

        // Show feedback
        const feedbackDiv = document.getElementById('feedback');
        if (feedbackDiv) {
            feedbackDiv.style.display = 'block';
            feedbackDiv.innerHTML = `
                <h3>✓ Answer Saved!</h3>
                <p>Click Next to continue to the next question.</p>
            `;
        }

        // Hide submit button
        const submitButton = document.getElementById('submit-btn');
        if (submitButton) {
            submitButton.style.display = 'none';
        }

        // Show next button
        const nextButton = document.getElementById('next-btn');
        if (nextButton) {
            nextButton.style.display = 'inline-block';
        }

    } catch (error) {
        console.error('Error saving progress:', error);
        alert('Failed to save your answer. Please try again.');
    }
}

function saveAnswer(answers) {
    const currentQuestion = parseInt(window.location.pathname.split('/').pop());
    
    // Get existing progress
    let progress = JSON.parse(localStorage.getItem('quiz_progress') || '{}');
    
    // Update progress
    progress[currentQuestion] = answers;
    
    // Save to localStorage
    localStorage.setItem('quiz_progress', JSON.stringify(progress));
    
    // Also save to server
    fetch('/save_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress)
    });
}

function showFeedback(answers) {
    if (!answers) {
        feedbackDiv.querySelector('.feedback-text').textContent = 'Please select an answer';
        feedbackDiv.style.display = 'block';
        return;
    }
    
    // Show feedback based on answer type
    const questionType = document.querySelector('.quiz-content').getAttribute('data-question-type');
    if (questionType === 'scenario') {
        const isCorrect = answers === correctAnswer;
        showResult(isCorrect);
    } else if (questionType === 'identify') {
        const isCorrect = arraysEqual(answers.sort(), correctAnswers.sort());
        showResult(isCorrect);
    } else if (questionType === 'match') {
        const isCorrect = Object.keys(answers).every(tech => 
            answers[tech] === correctMatches[tech]);
        showResult(isCorrect);
    }
    
    // Show next button
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'block';
}

function showResult(isCorrect) {
    const icon = feedbackDiv.querySelector('.result-icon');
    const text = feedbackDiv.querySelector('.feedback-text');
    
    if (isCorrect) {
        icon.textContent = '✓';
        icon.className = 'result-icon correct';
        text.textContent = 'Correct! Well done!';
    } else {
        icon.textContent = '✗';
        icon.className = 'result-icon incorrect';
        text.textContent = 'Not quite right. Here\'s the correct answer:';
    }
    
    feedbackDiv.style.display = 'block';
}