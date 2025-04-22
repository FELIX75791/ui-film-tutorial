const techData = {
    "leading-lines": {
      image: "/static/img/leading_lines.jpg",
      text: "Leading lines draw the viewer's eye through the image, often toward the subject."
    },
    "symmetry": {
      image: "/static/img/symmetry.jpg",
      text: "Symmetry creates a sense of balance and harmony by mirroring elements within the frame."
    },
    "rule-of-thirds": {
      image: "/static/img/rule_of_thirds.jpg",
      text: "The rule of thirds divides the frame into 9 parts and places key elements along the lines or intersections."
    }
  };
  
  function changeTechnique(type) {
    const img = document.getElementById("techImage");
    const desc = document.getElementById("techDescription");
    const buttons = document.querySelectorAll(".tech-btn");
  
    img.src = techData[type].image;
    desc.textContent = techData[type].text;
  
    buttons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.tech-btn[onclick*="${type}"]`).classList.add("active");
  }
  