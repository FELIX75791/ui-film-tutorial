$(function () {
  const ANSWERS = { q1: "Dutch" };               // add others…

  $("#quiz-form").on("submit", function (e) {
    e.preventDefault();
    let score = 0;
    // ----- grade radio questions
    if ($("input[name='q1']:checked").val() === ANSWERS.q1) score++;

    // grade checkbox or drag‑drop questions here …

    // show immediate feedback
    $("#score-box")
      .removeClass("hidden")
      .html(`<h2>Your score: ${score}/1</h2>`);
  });
});
