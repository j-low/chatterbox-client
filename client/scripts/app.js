// App Object - wrap all functionality within an app object
// Init function

// Create APP object to hold all variables and methods to be utilized by Chatterbox app
var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  friends : {},
  currentRoom : "lobby",
  rooms : {}
};

// Create INIT function to initialize Chatterbox functionality upon page load
app.init = function() {
  // Get/store username and room upon page load
  window.user = prompt("Please enter your username: ") || "anonymous";
  // default to lobby
  window.room = app.currentRoom;

  // Initialize refresh timer to load new messages from server
  setInterval(app.fetch, 20000);

  // Open document.ready to be able to handle event listeners
  $(document).ready(function() {
    // listen for messages being sent
    $('.submit').on('click', function(event) {
      event.preventDefault();
      var username = "temp";
      var text = $('.message_text').val();
      var roomname = "tempRoom";
      var msgObj = {
        'username':username,
        'text':text,
        'roomname':roomname
      };
      $('.message_text').val('');
      app.send(msgObj);
      app.fetch();
    });

    // listen for clicks on usernames to add friends

  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    // dataFilter: '-createdAt',
    data: {
      order: "-createdAt"
    },
    success: function(response) {
      console.log(response);
      app.clearMessages();
      _.each(response["results"], function(message) {
        app.rooms[message.roomname] = message.roomname;
        app.addMessage(message);
      });
      for (roomname in app.rooms) {
        $("select").append('<option value="' + roomname + '">' + roomname + '</option>');
      }
    },
    error: function(message) {
      console.log("Message failed to send.  Error: ", message);
    }
  });
};

app.send = function(message) {
  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',

    success: function(message) {
      console.log(message);
    },
    error: function(message) {
      console.log("Message failed to send.");
    }
  });
};

app.addMessage = function(response) {
  // TODO: Take out of addMessage to avoid multiple instances of the same event listener.
  $('.chat_item').on('click', function() {
    var user = $(this).attr('id');
    app.addFriend(user);
  });
  if(typeof response.username === "string" && typeof response.text === "string") {
    // test for <script> tag
    if (response.text.match(/[<>]/g)) {
      var message = "ILLEGAL MESSAGE";
    } else {
      var message = '<span class="chat_item" id=' + response.username + '>' + response.username + "</span>" + ": " + response.text;
    }

    //TODO: add friend class to clicked friends
    if (response.username in app.friends) {
      message = "<b>" + message + "</b>";
    }

    // add messages for specific room if dropdown is not "lobby"
    if (app.currentRoom === "lobby" || response.roomname === app.currentRoom) {
      $("#chats").append("<p>" + message + "</p>");
    }
  }
};

app.clearMessages = function() {
  $('#chats').empty();
};

// Escaping: What to avoid in user input
// < >

// addFriend method
app.addFriend = function(user) {
  app.friends[user] = user;
  // event listener for clicks on usernames
  // add username property to friends object
  // add friends class to html elements
  // bold elements upon next refresh
};

  $(document).ready(function() {
    $('select').on('change', function() {
      // event.preventDefault();
      var selectedRoom = $(this).val();
      console.log(selectedRoom);
      app.currentRoom = selectedRoom;
      app.fetch();
    });
    // app.clearMessages();
    // var filteredChats =
  });

// on fetch, refresh list of chat rooms and populate into an object
// for each value in object, add to the drop-down list
