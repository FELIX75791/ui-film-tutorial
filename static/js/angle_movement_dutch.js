const angleSlider = document.getElementById("angleRange");
const image = document.getElementById("dutchImage");
const angleLabel = document.getElementById("angleLabel");

angleSlider.addEventListener("input", () => {
  const angle = angleSlider.value;
  image.style.transform = `rotate(${angle}deg)`;
  angleLabel.textContent = `${angle}°`;
});
