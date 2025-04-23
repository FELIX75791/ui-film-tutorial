// /* angle_movement_dutch.js */
// const angleSlider = document.getElementById("angleRange");
// const image = document.getElementById("dutchImage");
// const angleLabel = document.getElementById("angleLabel");

// angleSlider.addEventListener("input", () => {
//   const angle = angleSlider.value;
//   image.style.transform = `rotate(${angle}deg)`;
//   angleLabel.textContent = `${angle}°`;
// });


/* linlinzhang */
/**
 * Dutch Angle Interactive Script
 * Controls the Dutch angle slider functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  const angleSlider = document.getElementById('angleRange');
  const dutchImage = document.getElementById('dutchImage');
  const angleLabel = document.getElementById('angleLabel');

  if (!angleSlider || !dutchImage || !angleLabel) return;

  // Initialize the angle display
  angleLabel.textContent = `${angleSlider.value}°`;

  // Update the image rotation and label when slider changes
  angleSlider.addEventListener('input', function() {
      const angle = this.value;
      dutchImage.style.transform = `rotate(${angle}deg)`;
      angleLabel.textContent = `${angle}°`;
      
      // Save user interaction to track progress
      saveProgress('dutch_angle_interaction', {
          angle: angle,
          timestamp: new Date().toISOString()
      });
  });

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