"use strict";

var staticCache = require('koa-static-cache');
var koa = require('koa.io');
var path = require('path');
var fs = require('fs');

console.log(path.join(__dirname, '../..'))

var app = koa();

var port = process.env.PORT || 3000;

// Routing

app.use(staticCache("frontend/public", {}, {}));
app.use(staticCache(path.join(__dirname, 'frontend/public')));

app.use(function*() {
  this.body = fs.createReadStream(path.join(__dirname, 'frontend/public/index.html'));
  this.type = 'html';
});

app.listen(port, function () {
  console.log('Server listening on port %d', port);
});

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

// middleware for connect and disconnect
app.io.use(function* userLeft(next) {
  // on connect
  console.log('somebody connected');
  console.log(this.headers)
  yield* next;
  // on disconnect
  if (this.addedUser) {
    delete usernames[this.username];
    --numUsers;

    // echo globally that this client has left
    this.broadcast.emit('user left', {
      username: this.username,
      numUsers: numUsers
    });
  }
});


/**
 * router for socket event
 */

app.io.route('add user', function* (next, username) {
  // we store the username in the socket session for this client
  this.username = username;
  // add the client's username to the global list
  usernames[username] = username;
  ++numUsers;
  this.addedUser = true;
  this.emit('login', {
    numUsers: numUsers
  });

  // echo globally (all clients) that a person has connected
  this.broadcast.emit('user joined', {
    username: this.username,
    numUsers: numUsers
  });
});

// when the client emits 'new message', this listens and executes
app.io.route('new message', function* (next, message) {
  // we tell the client to execute 'new message'
  this.broadcast.emit('new message', {
    username: this.username,
    message: message
  });
});

// when the client emits 'typing', we broadcast it to others
app.io.route('typing', function* () {
  console.log('%s is typing', this.username);
  this.broadcast.emit('typing', {
    username: this.username
  });
});

// when the client emits 'stopped typing', we broadcast it to others
app.io.route('stopped typing', function* () {
  console.log('%s stopped typing', this.username);
  this.broadcast.emit('stopped typing', {
    username: this.username
  });
});
