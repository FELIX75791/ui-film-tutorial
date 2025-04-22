// main buttons map
const VID_MAP = {
  dissolve : "dissolve.mp4",
  fade     : "fade-in.mp4",
  wipes    : "wipes.mp4",
  iris     : "iris.mp4"
};
// sub‑choices
const SUB_VID = {
  "fade-in"  : "fade-in.mp4",
  "fade-out" : "fade-out.mp4"
};

$(function () {
  const video     = document.getElementById("transition-preview");
  const sourceTag = video.querySelector("source");
  const $fadeBar  = $("#fade-subbar");

  function swap(src){
    sourceTag.src = `/static/video/${src}`;
    video.load();   // reload the new file
    video.play();
  }

  $(".tbtn").on("click", function (){
    $(".tbtn").removeClass("active");
    $(this).addClass("active");

    const key = $(this).data("trans");
    swap(VID_MAP[key]);

    if (key === "fade")  $fadeBar.addClass("show");
    else                 $fadeBar.removeClass("show");
  });

  $(".sbtn").on("click", function (){
    swap(SUB_VID[$(this).data("sub")]);
  });
});
