// /* shot_composition_shots.js */
// const shotInfo = {
//     "extreme-wide": {
//       image: "/static/img/extreme_wide.jpg",
//       text: "The extreme wide shot shows a vast environment and is used to establish the setting or emphasize scale."
//     },
//     "wide": {
//       image: "/static/img/long.jpg",
//       text: "The wide shot (or long shot) frames the subject from head to toe and shows the surroundings."
//     },
//     "full": {
//       image: "/static/img/full.jpg",
//       text: "The full shot captures the entire subject in frame, often used to show movement or action."
//     },
//     "medium": {
//       image: "/static/img/medium.jpg",
//       text: "The medium shot typically frames from the waist up and is commonly used in dialogues."
//     },
//     "medium-close-up": {
//       image: "/static/img/medium_closeup.jpg",
//       text: "The medium close-up frames the subject from chest up, emphasizing facial expressions."
//     },
//     "close-up": {
//       image: "/static/img/close_up.jpg",
//       text: "The close-up tightly frames the subject’s face or an object to show detail or emotion."
//     },
//     "extreme-close-up": {
//       image: "/static/img/extreme_close_up.jpg",
//       text: "The extreme close-up zooms into a specific feature (like eyes or lips) for dramatic effect."
//     },
//     "establishing": {
//       image: "/static/img/establish.jpg",
//       text: "The establishing shot sets up the context for a scene by showing the setting from a distance."
//     }
//   };
  
//   function changeShot(type) {
//     const img = document.getElementById("shotImage");
//     const desc = document.getElementById("shotDescription");
//     const buttons = document.querySelectorAll(".shot-btn");
  
//     img.src = shotInfo[type].image;
//     desc.textContent = shotInfo[type].text;
  
//     buttons.forEach(btn => btn.classList.remove("active"));
//     document.querySelector(`.shot-btn[onclick*="${type}"]`).classList.add("active");
//   }
  


/* linlinzhang */
/**
 * Shot Types Interactive Script
 * Controls the display of different shot types and descriptions
 */
document.addEventListener('DOMContentLoaded', function() {
  const shotImage = document.getElementById('shotImage');
  const shotDescription = document.getElementById('shotDescription');
  const shotButtons = document.querySelectorAll('.shot-btn');
  
  if (!shotImage || !shotDescription || !shotButtons.length) return;
  
  // Shot information with image paths and descriptions
  const shotInfo = {
      'extreme-wide': {
          image: '/static/images/extreme_wide.jpg',
          text: 'The extreme wide shot shows a vast environment and is used to establish the setting or emphasize scale.'
      },
      'wide': {
          image: '/static/images/wide.jpg',
          text: 'The wide shot (or long shot) frames the subject from head to toe and shows the surroundings.'
      },
      'full': {
          image: '/static/images/full.jpg',
          text: 'The full shot captures the entire subject in frame, often used to show movement or action.'
      },
      'medium': {
          image: '/static/images/medium.jpg',
          text: 'The medium shot typically frames from the waist up and is commonly used in dialogues.'
      },
      'medium-close-up': {
          image: '/static/images/medium_close_up.jpg',
          text: 'The medium close-up frames the subject from chest up, emphasizing facial expressions.'
      },
      'close-up': {
          image: '/static/images/close_up.jpg',
          text: 'The close-up tightly frames the subject\'s face or an object to show detail or emotion.'
      },
      'extreme-close-up': {
          image: '/static/images/extreme_close_up.jpg',
          text: 'The extreme close-up zooms into a specific feature (like eyes or lips) for dramatic effect.'
      },
      'establishing': {
          image: '/static/images/establishing.jpg',
          text: 'The establishing shot sets up the context for a scene by showing the setting from a distance.'
      }
  };
  
  // Function to change the displayed shot
  window.changeShot = function(type) {
      if (!shotInfo[type]) return;
      
      // Update image and description
      shotImage.src = shotInfo[type].image;
      shotDescription.textContent = shotInfo[type].text;
      
      // Update active button state
      shotButtons.forEach(btn => {
          btn.classList.remove('active');
      });
      
      // Find the clicked button and add active class
      document.querySelector(`.shot-btn[onclick*="${type}"]`).classList.add('active');
      
      // Save user interaction to track progress
      saveProgress('shot_type_interaction', {
          shot_type: type,
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