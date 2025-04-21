// static/js/main.js
console.log("[main.js] loaded");

$(function () {
  $(".dropbtn").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest(".dropdown").toggleClass("open");
    $(".dropdown").not($(this).closest(".dropdown")).removeClass("open");
  });
  $(document).on("click", () => $(".dropdown").removeClass("open"));
});
