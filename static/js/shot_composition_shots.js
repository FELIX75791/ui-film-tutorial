const shotInfo = {
    "extreme-wide": {
      image: "/static/img/extreme_wide.jpg",
      text: "The extreme wide shot shows a vast environment and is used to establish the setting or emphasize scale."
    },
    "wide": {
      image: "/static/img/long.jpg",
      text: "The wide shot (or long shot) frames the subject from head to toe and shows the surroundings."
    },
    "full": {
      image: "/static/img/full.jpg",
      text: "The full shot captures the entire subject in frame, often used to show movement or action."
    },
    "medium": {
      image: "/static/img/medium.jpg",
      text: "The medium shot typically frames from the waist up and is commonly used in dialogues."
    },
    "medium-close-up": {
      image: "/static/img/medium_closeup.jpg",
      text: "The medium close-up frames the subject from chest up, emphasizing facial expressions."
    },
    "close-up": {
      image: "/static/img/close_up.jpg",
      text: "The close-up tightly frames the subject’s face or an object to show detail or emotion."
    },
    "extreme-close-up": {
      image: "/static/img/extreme_close_up.jpg",
      text: "The extreme close-up zooms into a specific feature (like eyes or lips) for dramatic effect."
    },
    "establishing": {
      image: "/static/img/establish.jpg",
      text: "The establishing shot sets up the context for a scene by showing the setting from a distance."
    }
  };
  
  function changeShot(type) {
    const img = document.getElementById("shotImage");
    const desc = document.getElementById("shotDescription");
    const buttons = document.querySelectorAll(".shot-btn");
  
    img.src = shotInfo[type].image;
    desc.textContent = shotInfo[type].text;
  
    buttons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.shot-btn[onclick*="${type}"]`).classList.add("active");
  }
  