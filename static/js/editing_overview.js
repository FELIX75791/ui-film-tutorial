// simple focus outline helper – no heavy JS needed
document.addEventListener("keydown", e => {
  if (e.key === "Tab") document.body.classList.add("keyboard-nav");
});
