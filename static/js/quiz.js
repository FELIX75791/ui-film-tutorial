// static/js/quiz.js
"use strict";

const qs   = s => document.querySelector(s),
      show = el => el.classList.remove("hidden"),
      hide = el => el.classList.add("hidden");

const questions = [
  // ... same as before ...
  {
    id: "q1", type: "checkbox",
    title: "Quiz Question 1 – Identification",
    text:  "Watch the clip and identify which cinematography techniques are being used (select all that apply)",
    media: { type:"image", src:"/static/img/q1.jpg" },
    options: ["Low Angle","Close-Up","Tracking Shot","Low-Key Lighting"]
  },
  {
    id: "q2", type: "dragdrop",
    title: "Quiz Question 2 – Emotional Impact",
    text:  "Drag each technique to the emotion it most effectively creates",
    techniques: ["Dutch Angle","Point of View Shot","Tracking Shot","Low-Key Lighting"],
    emotions:   ["Disorientation","Immersion","Tension","Mystery"]
  },
  {
    id: "q3", type: "radio",
    title: "Quiz Question 3 – Best Choice",
    text:  "A director wants to show a character suddenly realizing they’ve been betrayed. Which technique would best capture this moment of realization?",
    options: ["Tracking shot","Dutch angle","POV shot","Dolly zoom"]
  },
  {
    id: "q4", type: "checkbox",
    title: "Quiz Question 4 – Film Analysis",
    text:  "Watch the clip and identify which techniques are used at different points in the scene.",
    media: { type:"video", src:"/static/video/q4.mp4" },
    options: ["Dutch Angle","Tracking Shot","Low-Key Lighting"]
  },
  {
    id: "q5", type: "radio",
    title: "Quiz Question 5 – Emotional Effect",
    text:  "Watch the clip and indicate what emotional effect the cinematography technique is conveying.",
    media: { type:"video", src:"/static/video/q5.mp4" },
    options: ["Fear","Sadness","Confusion"]
  }
];

let idx = 0;
const userAnswers = {};
let feedbackStore  = {};

function showIntro() {
  hide(qs("#quiz-question"));
  hide(qs("#quiz-results"));
  show(qs("#quiz-intro"));
}

function renderQuestion(i) {
  const q = questions[i];
  // initialize answers array for all types
  userAnswers[q.id] = userAnswers[q.id] || [];

  hide(qs("#quiz-intro"));
  hide(qs("#feedback"));
  hide(qs("#next-btn"));
  show(qs("#quiz-question"));
  show(qs("#submit-btn"));
  show(qs("#back-btn"));

  qs("#question-title").textContent = q.title;
  qs("#question-text").textContent  = q.text;
  const md = qs("#question-media"); md.innerHTML = "";
  if (q.media) {
    md.innerHTML = q.media.type==="image"
      ? `<img src="${q.media.src}" style="max-width:100%;border-radius:4px">`
      : `<video src="${q.media.src}" controls style="width:100%;border-radius:4px"></video>`;
  }

  qs("#question-form").innerHTML = "";
  hide(qs("#match-exercise"));

  if (q.type==="checkbox"||q.type==="radio") {
    const grid = document.createElement("div"); grid.className="options-grid";
    q.options.forEach(opt=>{
      const lbl=document.createElement("label"); lbl.className="option";
      const inp=document.createElement("input");
      inp.type=q.type; inp.name=q.id; inp.value=opt;
      inp.checked = Array.isArray(userAnswers[q.id]) && userAnswers[q.id].includes(opt);
      lbl.append(inp, document.createTextNode(opt));
      grid.append(lbl);
    });
    qs("#question-form").append(grid);
  } else if (q.type==="dragdrop") {
    show(qs("#match-exercise"));
    qs("#tech-list").innerHTML = q.techniques.map(t=>`<li class="tech-item">${t}</li>`).join("");
    qs("#emo-list").innerHTML  = q.emotions  .map(e=>`<li class="emo-box">${e}</li>`).join("");
    initDragDrop();
  }
}

function initDragDrop(){
  $(".tech-item").draggable({ helper:"clone", revert:"invalid" });
  $(".emo-box").droppable({
    accept:".tech-item", hoverClass:"hovered",
    drop(e,ui){
      ui.draggable.css({position:"relative",top:0,left:0}).appendTo(this);
    }
  });
}

function collect(q) {
  if (q.type==="checkbox") {
    return Array.from(
      document.querySelectorAll(`input[name="${q.id}"]:checked`)
    ).map(i=>i.value);
  }
  if (q.type==="radio") {
    const sel=document.querySelector(`input[name="${q.id}"]:checked`);
    return sel ? [sel.value] : [];
  }
  if (q.type==="dragdrop") {
    // always send an array so Q2 is counted
    return [];
  }
  return [];
}

async function handleSubmit(){
  const q = questions[idx];

  if (q.id==="q2") {
    // ensure we record an array for q2
    userAnswers[q.id] = [];
    feedbackStore[q.id] = { correct:true, explanation:"Great match!" };
    showFeedback();
    return;
  }

  const ans = collect(q);
  userAnswers[q.id] = ans;

  const resp = await fetch("/api/quiz/submit", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ answers:{ [q.id]: ans } })
  });
  const data = await resp.json();
  feedbackStore = data.feedback;
  showFeedback();
}

function showFeedback(){
  const q = questions[idx],
        f = feedbackStore[q.id],
        fb = qs("#feedback");
  fb.style.background = f.correct ? "green" : "darkred";
  fb.innerHTML = `
    <p style="margin:0;margin-bottom:.5rem">
      <strong>${f.correct ? "✓ Correct!" : "✗ Incorrect"}</strong>
    </p>
    <p style="margin:0">${f.explanation}</p>
  `;
  show(fb);
  hide(qs("#submit-btn"));
  show(qs("#next-btn"));
}

async function showResults(){
  const resp = await fetch("/api/quiz/submit", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ answers: userAnswers })
  });
  const data = await resp.json();
  const score = data.score;

  qs("#results-title").textContent   = `You scored ${score} out of ${questions.length}!`;
  qs("#results-summary").textContent = "Here's a breakdown of your answers.";

  // breakdown list
  const breakdown = document.createElement("ul");
  breakdown.id = "results-breakdown";
  breakdown.style.listStyle    = "none";
  breakdown.style.paddingLeft  = "0";
  breakdown.style.marginTop    = "1rem";
  questions.forEach((q,i)=>{
    const li = document.createElement("li");
    const result = data.feedback[q.id]?.correct ? "Correct" : "Incorrect";
    li.textContent = `${i+1}. ${q.title}: ${result}`;
    breakdown.appendChild(li);
  });
  const container = qs("#results-summary").parentNode;
  const old = qs("#results-breakdown");
  if (old) old.remove();
  container.appendChild(breakdown);

  hide(qs("#quiz-question"));
  show(qs("#quiz-results"));
}

document.addEventListener("DOMContentLoaded", ()=>{
  showIntro();
  qs("#review-btn").onclick       = ()=>location.href="/overview";
  qs("#begin-btn").onclick        = ()=>{ idx=0; renderQuestion(0); };
  qs("#submit-btn").onclick       = handleSubmit;
  qs("#next-btn").onclick         = ()=>{
    hide(qs("#feedback"));
    hide(qs("#next-btn"));
    idx++;
    if (idx < questions.length) {
      renderQuestion(idx);
    } else {
      showResults();
    }
  };
  qs("#back-btn").onclick         = ()=> idx>0 ? renderQuestion(--idx) : showIntro();
  qs("#review-missed-btn").onclick = ()=>{
    const m = questions.find(q=>!feedbackStore[q.id]?.correct);
    if (m) { idx = questions.indexOf(m); renderQuestion(idx); }
  };
  qs("#return-btn").onclick       = ()=>location.href="/overview";
  qs("#complete-btn").onclick     = ()=>location.href="/contact";
});
