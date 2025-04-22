$(function () {
  const $light = $("#light-preview");
  const $color = $("#color-preview");

  // lighting buttons
  $("button.grp.a").on("click", function (){
    $("button.grp.a").removeClass("active");
    $(this).addClass("active");
    const key = $(this).data("light");
    $light.attr("src", `/static/img/${key}.jpg`);
  });

  // color‑scheme buttons
  $("button.grp.b").on("click", function (){
    $("button.grp.b").removeClass("active");
    $(this).addClass("active");
    const key = $(this).data("color");
    $color.attr("src", `/static/img/${key}.jpg`);
  });
});
