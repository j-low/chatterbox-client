var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  friends : {},
  currentRoom : "lobby",
  rooms : {}
};

//initialize app
app.init = function() {
  $(document).ready(function() {
  //Cache DOM elements
  $chatContainer = $('#chatContainer');
  $sendMessage = $('#sendMessage');
  $messageBox = $('#messageBox');
  $roomSelect = $('#roomSelect');
  $roomCreate = $('#roomCreate');
  $generateNewRoom = $('#generateNewRoom');

  // Event listener functions:
    // Add friend upon username click
    $chatContainer.on('click', '.username', app.addFriend);
    // Send a message upon clicking submit (Send Message button)
    $sendMessage.on('submit', app.handleSubmit);
    //Set currentRoom upon selecting from dropdown
    $roomSelect.on('change', app.setRoom);
    // Add room upon clicking submit (Add Room button)
    $roomCreate.on('submit', app.addRoom);

    // Get/store username and room upon page load
    window.user = prompt("Please enter your username: ") || "anonymous";
    // default to lobby
    window.room = app.currentRoom;

    app.fetch();

    setInterval(app.fetch, 10000);
  });
};

//fetch new messages from server
app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {
      order: "-createdAt"
    },
    success: function(response) {
      console.log(response);
      app.clearMessages();
      //loop through all messages in response, addMessage to DOM
      var temp = response["results"].slice(0, 10);
      _.each(temp, function(message) {
        app.rooms[message.roomname] = message.roomname;
        app.addMessage(message);
      });

      for (roomname in app.rooms) {
        $roomSelect.append('<option value="' + roomname + '">' + roomname + '</option>');
      }
    },
    error: function(message) {
      console.log("Message failed to send.  Error: ", message);
    }
  });
};

//post new message to server from user
app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',

    success: function(message) {
    },
    error: function(message) {
      console.log("Message failed to send.");
    }
  });
};

//add message to $chatContainer
app.addMessage = function(response) {
  if(typeof response.username === "string" && typeof response.text === "string") {
    if (response.text.match(/[<>]/g)) {
      var message = "ILLEGAL MESSAGE";
    } else {
      var message = '<span class="username" id="' + response.username + '">' + response.username + "</span>" + ": " + response.text;
    }

    //Make bold if user === friend
    if (response.username in app.friends) {
      message = "<b>" + message + "</b>";
    }

    // add messages for specific room if dropdown is not "lobby"
    if (app.currentRoom === "lobby" || response.roomname === app.currentRoom) {
      $("#chatContainer").append('<p>' + message + '</p>');
    }
  }
};

//clear chat window
app.clearMessages = function() {
  $chatContainer.empty();
};

// addFriend method
app.addFriend = function(event) {
  var user = event.target.id;
  app.friends[user] = user;
};

//set currentRoom
app.setRoom = function(event) {
  event.preventDefault();
  var selectedRoom = $(this).val();
  app.currentRoom = selectedRoom;
  $(app.currentRoom).attr('id', 'roomSelect');
  app.fetch();
};

//add room to 'select' dropdown
app.addRoom = function(event) {
  event.preventDefault();
  var roomname = $generateNewRoom.val();
  $roomSelect.append('<option value="' +
                           roomname +
                           '">' +
                           roomname +
                           '</option>');
  $generateNewRoom.val('');
};

//handle submit event on $sendMessage
app.handleSubmit = function(event) {
  event.preventDefault();
  // create message object to be passed into Parse
  var username = "temp";
  var text = $messageBox.val();
  var roomname = "tempRoom";
  var msgObj = {
    'username':username,
    'text':text,
    'roomname':roomname
  };
  // set the message box back to empty after storing the value
  $messageBox.val('');
  // send the message to Parse
  app.send(msgObj);
  // refresh the chatroom window
  app.fetch();
};

