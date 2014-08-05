// App Object - wrap all functionality within an app object
// Init function

// Create APP object to hold all variables and methods to be utilized by Chatterbox app
var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  friends : {},
  currentRoom : "lobby",
  rooms : {}
};

app.init = function() {

// Event listener functions:
  $(document).ready(function() {
    // Add friend upon username click
    $('#chats').on('click', '.username', app.addFriend);
    // Send a message upon clicking submit
    $('.submitter').on('submit', app.handleSubmit);




// Create INIT function to initialize Chatterbox functionality upon page load
  // Get/store username and room upon page load
  window.user = prompt("Please enter your username: ") || "anonymous";
  // default to lobby
  window.room = app.currentRoom;
  });
};

app.handleSubmit = function(event) {
  event.preventDefault();
  console.log("TRIGGERED");
  // create message object to be passed into Parse
  var username = "temp";
  var text = $('.message_box').val();
  var roomname = "tempRoom";
  var msgObj = {
    'username':username,
    'text':text,
    'roomname':roomname
  };

  // set the message box back to empty after storing the value
  $('.message_box').val('');

  // send the message to Parse
  app.send(msgObj);

  // refresh the chatroom window
  app.fetch();
};

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
        console.log(message);
      });

      //set event listener for 'addFriend' click on new DOM elements
      // $('.username').on('click', function(event) {
      // console.log(event);
      //   var user = $(this).attr('id');
      //   app.addFriend(user);
      // });
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
  if(typeof response.username === "string" && typeof response.text === "string") {
    // test for <script> tag
    if (response.text.match(/[<>]/g)) {
      var message = "ILLEGAL MESSAGE";
    } else {
      var message = '<span class="username" id="' + response.username + '">' + response.username + "</span>" + ": " + response.text;
    }

    //TODO: add friend class to clicked friends
    if (response.username in app.friends) {
      message = "<b>" + message + "</b>";
    }

    // add messages for specific room if dropdown is not "lobby"
    if (app.currentRoom === "lobby" || response.roomname === app.currentRoom) {
      $("#chats").append('<p>' + message + '</p>');
    }
  }
};

app.clearMessages = function() {
  $('#chats').empty();
};

// Escaping: What to avoid in user input
// < >

// addFriend method
app.addFriend = function(event) {
  // return string of username
  var user = event.target.id;
  app.friends[user] = user;
  // event.target.addClass('friend');
};

/*TODO: move to top  KEEP DON'T DELETE
  $(document).ready(function() {
    $('select').on('change', function() {
      // event.preventDefault();
      // var selectedRoom = $(this).val();
      // console.log(selectedRoom);
      // app.currentRoom = selectedRoom;
      // $(app.currentRoom).attr('id', 'roomSelect');
      // app.fetch();
    });
    // app.clearMessages();
    // var filteredChats =
  });
*/


app.addRoom = function(roomname) {
  $('#roomSelect').append('<option val="' +
                           roomname +
                           '">' +
                           roomname +
                           '</option>');

  // var roomSelect = $(this).val();
  // $(this).attr('id', roomSelect);
  // app.currentRoom = roomSelect;
  // app.fetch();
};

// on fetch, refresh list of chat rooms and populate into an object
// for each value in object, add to the drop-down list
