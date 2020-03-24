$(document).ready(function() {
  $("#tweet-text").on("keyup", function() {
    $(this).parent().children(".new-tweet-bottom").children(".counter").val(140 - this.value.length);
    if (this.value.length > 140) {
      $(this).parent().children(".new-tweet-bottom").children(".counter").css("color", "red");
    } else {
      $(this).parent().children(".new-tweet-bottom").children(".counter").css("color", "#545149");
    }
  });
});