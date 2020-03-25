// Accepts a tweet object as a parameter and returns how long ago it was posted
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

// Convery escape characters to prevent XSS
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Build HTML elements for new tweet
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

// Accepts a data array containin all tweets renders them to the tweets container
const renderTweets = function(tweets) {
    $('#tweets-container').empty();
  for (tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
}

// Perform an AJAX request to fetch all tweets from database
const loadTweets = () => {

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
  // Fetch all existing tweets and render them to the page
  loadTweets();

  $("#new-tweet-form").on('submit', function (event) {
    // Prevent page from refreshing
    event.preventDefault();

    // Form is empty
    if (!$("#tweet-text").val()) {
      $(".tweet-error").text("Cannot submit an empty tweet");
      $(".tweet-error").slideDown();

    // Input has too many characters
    } else if ($("#tweet-text").val().length > 140) {
      $(".tweet-error").text("Number of characters must be less than 140");
      $(".tweet-error").slideDown();

    // Form submitted successfully
    } else {
      console.log('Form submitted, performing ajax call...');

      $.ajax('/tweets', { 
        method: 'POST',
        data: $(this).serialize(),
        success: (data) => {
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

  // New tweet form toggler
  $(".nav-right button").on('click', function () {
    $("section.new-tweet").slideToggle();
    $("#tweet-text").focus();
  });

  $(".nav-right i").on('click', function () {
    $("section.new-tweet").slideToggle();
    $("#tweet-text").focus();
  });

  // Reveal scroll-button if user has scrolled down (see below)
  // Hide tweet form toggler if user has scrolled down
  $(window).on("scroll", function () {
    if ($(window).scrollTop() === 0) {
      $(".nav-right").css("display", "block");
      $(".scroll-button").css("display", "none");
    } else {
      $(".nav-right").css("display", "none");
    }
    if ($(window).scrollTop() > 100) {
      $(".scroll-button").css("display", "inline-block");
    }
  });

  // Scrolls to the top when clicked and opens the new tweet form
  $(".scroll-button").on("click", function () {
    $(window).scrollTop(0);
    $("section.new-tweet").slideDown();
    $("#tweet-text").focus();
    $(".scroll-button").css("display", "none");
  });




});
