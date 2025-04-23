// /* angle_movement_angles.js */
// function changeAngle(type) {
//     const img = document.getElementById("angleImage");
//     const buttons = document.querySelectorAll(".angle-btn");
  
//     if (type === "low") {
//       img.src = "/static/img/lowAngle.jpg";
//     } else if (type === "eye") {
//       img.src = "/static/img/eyeLevel.jpg";
//     } else if (type === "high") {
//       img.src = "/static/img/highAngle.jpg";
//     }
  
//     buttons.forEach(btn => btn.classList.remove("active"));
//     document.querySelector(`.angle-btn[onclick*="${type}"]`).classList.add("active");
//   }
  


/**
 * Camera Angles Interactive Script
 * Controls switching between different camera angles
 */
document.addEventListener('DOMContentLoaded', function() {
  // Check if the necessary elements exist
  const angleImage = document.getElementById('angleImage');
  const angleButtons = document.querySelectorAll('.angle-btn');
  
  if (!angleImage || !angleButtons.length) return;

  // Function to change the angle
  window.changeAngle = function(type) {
      // Update the image source based on the selected angle
      if (type === 'low') {
          angleImage.src = '/static/images/low_angle.jpg';
      } else if (type === 'eye') {
          angleImage.src = '/static/images/eye_level.jpg';
      } else if (type === 'high') {
          angleImage.src = '/static/images/high_angle.jpg';
      }
      
      // Update active button state
      angleButtons.forEach(btn => {
          btn.classList.remove('active');
      });
      
      // Find the clicked button and add active class
      document.querySelector(`.angle-btn[onclick*="${type}"]`).classList.add('active');
      
      // Save user interaction to track progress
      saveProgress('camera_angle_interaction', {
          angle_type: type,
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