/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

const renderTweets = function(tweets) {
  for (tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet);
  }
}

const createTweetElement = (tweetData) => {
  const markup = `
  <article class="tweet">
    <header>
      <span>${tweetData.user.name}</span><span class="username">${tweetData.user.handle}</span>
    </header>
    <p>${tweetData.content.text}</p>
    <footer>
      <span>${tweetData.created_at}</span><span>icons</span>
    </footer>
  </article>
  `;
  return markup;
}





$(document).ready(function() {
  renderTweets(data);

  $("#new-tweet-form").on('submit', function (event) {
    event.preventDefault();
    console.log('Form submitted, performing ajax call...');

    // const newTweetData = {
    //   user: {
    //     name: "Dexter",
    //     avatars: "",
    //     handle: "@TRexDex"
    //   },
    //   content: {
    //     text: "dinosaur sounds"
    //   },
    //   created_at: Date.now()
    // };

    $.ajax('/tweets', { 
      method: 'POST',
      data: $(this).serialize(),
      success: (data) => {
        alert("success!");
      },
      error: () => {
        alert("error!");
      }
    });

  });
});
