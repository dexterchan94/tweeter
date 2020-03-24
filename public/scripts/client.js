/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const timeElapsed = function(tweetData) {
  const time = (Date.now() - tweetData.created_at) / 1000;
  if (time < 60) {
    return `${time.toFixed(0)} seconds ago`;
  } else if (time < 60 * 60) {
    return `${(time / 60).toFixed(0)} minutes ago`;
  } else if (time < 60 * 60 * 24) {
    return `${(time / 60 / 60).toFixed(0)} hours ago`;
  } else if (time < 60 * 60 * 24 * 365) {
    return `${(time / 60 / 60 / 24).toFixed(0)} days ago`;
  } else {
    return `${(time / 60 / 60 / 24 / 365).toFixed(0)} years ago`;
  }
};

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const createTweetElement = (tweetData) => {
  const markup = `
  <article class="tweet">
  <header>
  <div>
  <img src="${tweetData.user.avatars}">
  <span> ${tweetData.user.name}</span>
  </div>
  <span class="username">${tweetData.user.handle}</span>
  </header>
  <p>${escape(tweetData.content.text)}</p>
  <footer>
  <span>${timeElapsed(tweetData)}</span><span><i class="fas fa-flag"></i><i class="fas fa-dove"></i><i class="fas fa-thumbs-up"></i></span>
  </footer>
  </article>
  `;
  return markup;
}

const renderTweets = function(tweets) {
    $('#tweets-container').empty();
  for (tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
}

const loadTweets = () => {
  console.log("Performing AJAX GET");

  $.ajax('/tweets', { 
    method: 'GET',
    success: (data) => {
      renderTweets(data);
    },
    error: () => {
      alert("error!");
    }
  });

};


$(document).ready(function() {

  loadTweets();

  $("#new-tweet-form").on('submit', function (event) {
    event.preventDefault();

    if (!$("#tweet-text").val()) {
      $(".tweet-error").text("Cannot submit an empty tweet");
      $(".tweet-error").slideDown();
    } else if ($("#tweet-text").val().length > 140) {
      $(".tweet-error").text("Number of characters must be less than 140");
      $(".tweet-error").slideDown();
    } else {
      console.log('Form submitted, performing ajax call...');

      $.ajax('/tweets', { 
        method: 'POST',
        data: $(this).serialize(),
        success: (data) => {
          console.log("AJAX POST success!");
          $(".tweet-error").slideUp();
          $('#tweet-text').val("");
          $('.new-tweet-bottom .counter').val("140");
          loadTweets();
        },
        error: () => {
          console.log("AJAX POST error!");
        }
      });
    }

  });

  $(".nav-right button").on('click', function () {
    $("section.new-tweet").slideToggle();
    $("#tweet-text").focus();
  });

  $(".nav-right i").on('click', function () {
    $("section.new-tweet").slideToggle();
    $("#tweet-text").focus();
  });

  $(window).on("scroll", function () {
    if ($(window).scrollTop() == 0) {
      $(".nav-right").css("display", "block");
    } else {
      $(".nav-right").css("display", "none");
    }
    $(".scroll-button").css("display", "inline-block");
  });

  $(".scroll-button").on("click", function () {
    $(window).scrollTop(0);
    $("section.new-tweet").slideDown()
    $("#tweet-text").focus()
    setTimeout(() => {
      $(".scroll-button").css("display", "none");
    }, 5);
  });




});
