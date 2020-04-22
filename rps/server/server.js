const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const RpsGame = require('./rps-game');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

var game;

var word = 'chair';
var definition = 'something you sit on';

var users = [];
var i = 0;
var gamestate = 0;

function shuffle(arra1) {
  let ctr = arra1.length;
  let temp;
  let index;

  // While there are elements in the array
  while (ctr > 0) {
// Pick a random index
      index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
      ctr--;
// And swap the last element with it
      temp = arra1[ctr];
      arra1[ctr] = arra1[index];
      arra1[index] = temp;
  }
  return arra1;
} 
const myArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(shuffle(myArray));



function gamestateOneTransition() {

  console.log('one');

// create bot to hold real definition
var person = {
  name: 'real',
  def: definition,
  choice: '0',
  socket: null
};

users[i] = person;

game = new RpsGame(users);
//i = 0;
//gamestate = 1;

game._sendToPlayers(word);

}



function gamestateTwoTransition() {

  console.log('two');

  shuffle(users);

  var i = 1;

  users.forEach((u) => {
    var d = u.def;
    d = i + ' '+ d;

    users.forEach((user) => {
      if (user.socket != null)
        user.socket.emit('message', d);
    });

    i++;
  });

}


function gamestateThreeTransition() {

  console.log('three');

  var i = 1;

  // get the definition
  users.forEach((u) => {
    var d = u.def;
    d = i + ' '+ d;
    d = d + '<BR/>';

    //find out who picked the definition
    users.forEach((user) => {
      if (user.choice == i)
        d = d + user.name + ' ';
    });

    d = d + ' picked it <BR/>';

    d = d + u.name + ' wrote it <BR/>';

    
    //send out the message
    users.forEach((user) => {
      if (user.socket != null)
        user.socket.emit('message', d);
    });

    i++;
  });

}


io.on('connection', (sock) => {

  if (waitingPlayer) {
    //new RpsGame(waitingPlayer, sock);
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit('message', 'Waiting for an opponent');
  }

  sock.on('message', (msg) => {
   
    if (msg == 'continue')
    {
      gamestate++;

      if (gamestate ==1)
        gamestateOneTransition();

      if (gamestate ==2)
        gamestateTwoTransition();  

      if (gamestate ==3)
        gamestateThreeTransition();  
    }
    else
    {
      if(gamestate == 0)
      {
        var person = {
          name: msg.userid,
          def: " ",
          choice: '0',
          socket: sock
        };

        users[i] = person;
        i++;

        //io.emit('message', text);
        
      }    
      else if(gamestate == 1)
      {
        users.forEach((user) => {
        if(user.name == msg.userid)
          user.def = msg.msg;
         });


      }
      else
      {
        users.forEach((user) => {
          if(user.name == msg.userid)
            user.choice = msg.msg;
        });

  
        

      }
    }
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(3000, '0.0.0.0', () => {
  console.log('RPS started on 3000');
});