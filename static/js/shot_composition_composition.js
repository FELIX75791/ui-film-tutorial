// /* shot_composition_composition.js */
// const techData = {
//     "leading-lines": {
//       image: "/static/img/leading_lines.jpg",
//       text: "Leading lines draw the viewer's eye through the image, often toward the subject."
//     },
//     "symmetry": {
//       image: "/static/img/symmetry.jpg",
//       text: "Symmetry creates a sense of balance and harmony by mirroring elements within the frame."
//     },
//     "rule-of-thirds": {
//       image: "/static/img/rule_of_thirds.jpg",
//       text: "The rule of thirds divides the frame into 9 parts and places key elements along the lines or intersections."
//     }
//   };
  
//   function changeTechnique(type) {
//     const img = document.getElementById("techImage");
//     const desc = document.getElementById("techDescription");
//     const buttons = document.querySelectorAll(".tech-btn");
  
//     img.src = techData[type].image;
//     desc.textContent = techData[type].text;
  
//     buttons.forEach(btn => btn.classList.remove("active"));
//     document.querySelector(`.tech-btn[onclick*="${type}"]`).classList.add("active");
//   }
  



/* linlinzhang */
/**
 * Composition Techniques Interactive Script
 * Controls the display of different composition techniques and descriptions
 */
document.addEventListener('DOMContentLoaded', function() {
  const techImage = document.getElementById('techImage');
  const techDescription = document.getElementById('techDescription');
  const techButtons = document.querySelectorAll('.tech-btn');
  
  if (!techImage || !techDescription || !techButtons.length) return;
  
  // Composition technique information
  const techData = {
      'leading-lines': {
          image: '/static/images/leading_lines.jpg',
          text: 'Leading lines draw the viewer\'s eye through the image, often toward the subject.'
      },
      'symmetry': {
          image: '/static/images/symmetry.jpg',
          text: 'Symmetry creates a sense of balance and harmony by mirroring elements within the frame.'
      },
      'rule-of-thirds': {
          image: '/static/images/rule_of_thirds.jpg',
          text: 'The rule of thirds divides the frame into 9 parts and places key elements along the lines or intersections.'
      }
  };
  
  // Function to change the displayed technique
  window.changeTechnique = function(type) {
      if (!techData[type]) return;
      
      // Update image and description
      techImage.src = techData[type].image;
      techDescription.textContent = techData[type].text;
      
      // Update active button state
      techButtons.forEach(btn => {
          btn.classList.remove('active');
      });
      
      // Find the clicked button and add active class
      document.querySelector(`.tech-btn[onclick*="${type}"]`).classList.add('active');
      
      // Save user interaction to track progress
      saveProgress('composition_technique_interaction', {
          technique_type: type,
          timestamp: new Date().toISOString()
      });
  };
  
  // Function to save progress to server
  function saveProgress(action, data) {
      fetch('/save_progress', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              action: action,
              data: data
          })
      })
      .catch(error => console.error('Error saving progress:', error));
  }
});