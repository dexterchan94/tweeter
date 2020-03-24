/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const renderTweets = function(tweets) {
    $('#tweets-container').empty();
  for (tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
}

const createTweetElement = (tweetData) => {

  const markup = `
  <article class="tweet">
    <header>
      <span>${tweetData.user.name}</span><span class="username">${tweetData.user.handle}</span>
    </header>
    <p>${escape(tweetData.content.text)}</p>
    <footer>
      <span>${tweetData.created_at}</span><span>icons</span>
    </footer>
  </article>
  `;
  return markup;
}


$(document).ready(function() {

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




});
