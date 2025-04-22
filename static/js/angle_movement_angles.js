function changeAngle(type) {
    const img = document.getElementById("angleImage");
    const buttons = document.querySelectorAll(".angle-btn");
  
    if (type === "low") {
      img.src = "/static/img/lowAngle.jpg";
    } else if (type === "eye") {
      img.src = "/static/img/eyeLevel.jpg";
    } else if (type === "high") {
      img.src = "/static/img/highAngle.jpg";
    }
  
    buttons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.angle-btn[onclick*="${type}"]`).classList.add("active");
  }
  