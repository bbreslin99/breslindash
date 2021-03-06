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

game = new RpsGame(users);

var fs = require('fs');
var words = fs.readFileSync('../../test.txt').toString().split("\n");
for(k in words) {
    console.log(words[k]);
}
console.log(words.length);

// create bot to hold real definition
var real = {
  name: 'real',
  def: "blank",
  choice: '999',
  socket: null
};

users[i] = real;
i++;

  //var h = 1 + Math.round(Math.random() * 3);
   //console.log(h);

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

//const myArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//console.log(shuffle(myArray));


function gamestateZeroTransition() {

  console.log('zero');

  users.forEach((user) => {
          if(user.name == 'host')
          {
            user.socket.emit('update', '');
          }	

        });
  

  users = [];

  gamestate = 0;
  i = 0;

  users[i] = real;
  i++;

  game._sendToPlayers('z');
  game._sendToPlayers('Welcome to Breslindash <BR/> <BR/> Enter Name');

  //writeEvent('Welcome to Breslindash <BR/> <BR/> Enter Name');

}


function gamestateOneTransition() {

  console.log('one');

  gamestate = 1;

  
  users.forEach((user) => {
    if(user.name !== 'real')
    {
       user.def = null;
       user.choice = null;
    }	

  });


  //reset users def and choice


  //i = 0;
  //gamestate = 1;

  var g = (words.length - 3)/2 - 1;
  
  var j = 1 + Math.round(Math.random() * g);
  
  j = j+j;
  word = words[j];
  definition = words[j+1];
//console.log(g);

  users.forEach((user) => {
    if(user.name == 'real')
    {
       user.def = definition;
    }	

  });

  //users[0].def = definition;

  game._sendToPlayers(word);

}



function gamestateTwoTransition() {

  console.log('two');

  //shuffle(users);

  var i = 1;
  var temp = '';

  users.forEach((u) => {
    var d = u.def;
    d = i + ' ' + d + '<BR/><BR/>';
    temp = temp + d + '';

    //users.forEach((user) => {
     // if (user.socket != null)
        //user.socket.emit('message', d);
    //});

    i++;
  });

  game._sendToPlayers(temp);

}









function gamestateTwoHostTransition() {

  console.log('twoHost');

  shuffle(users);

  var i = 1;
  var temp = '';

  users.forEach((u) => {
    var d = u.def;
    d = i + ' ' + d + '<BR/><BR/>';
    temp = temp + d + '';

    //users.forEach((user) => {
     // if (user.socket != null)
        //user.socket.emit('message', d);
    //});

    i++;
  });

  users.forEach((user) => {
          if(user.name == 'host')
          {
            //user.def = msg.msg;
            user.socket.emit('message', temp.fontcolor("maroon"));
          }	
        });

  //game._sendToPlayers(temp);

}












function gamestateThreeTransition() {

  console.log('three');

  var i = 1;
  var temp = '';
  var c = '';

  // get the definition
  users.forEach((u) => {
    var d = u.def;
    j = i + '';
    d = j.fontcolor("yellow") + ' '+ d;
    d = d + '<BR/>';

    c = '';

    //find out who picked the definition
    users.forEach((user) => {
      if (user.choice == i)
      {
        c = c + user.name + ' ';
      }
    });

    var r = c.fontcolor("green");

    if (c == '')
    {
      c = 'Nobody ';
      r = c.fontcolor("red");
    }

    d = d + r + ' picked it <BR/>';

    d = d + u.name.fontcolor("blue") + ' wrote it <BR/>';

    temp = temp + d + '<BR/>';
    
    //send out the message
    users.forEach((user) => {
      if (user.socket != null)
        user.socket.emit('message', temp);
    });

    i++;
  });

}












function gamestateThreeHostTransition() {

  console.log('threeHost');

  var i = 1;
  var temp = '';
  var c = '';

  // get the definition
  users.forEach((u) => {
    var d = u.def;
    j = i + '';
    d = j.fontcolor("yellow") + ' '+ d;
    d = d + '<BR/>';

    c = '';

    //find out who picked the definition
    users.forEach((user) => {
      if (user.choice == i)
      {
        c = c + user.name + ' ';
      }
    });

    var r = c.fontcolor("green");

    if (c == '')
    {
      c = 'Nobody ';
      r = c.fontcolor("red");
    }

    d = d + r + ' picked it <BR/>';

    d = d + u.name.fontcolor("blue") + ' wrote it <BR/>';

    temp = temp + d + '<BR/>';
    
    users.forEach((user) => {
          if(user.name == 'host')
          {
            //user.def = msg.msg;
            user.socket.emit('message', temp.fontcolor("maroon"));
          }	
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
    //waitingPlayer.emit('message', 'Waiting for an opponent');
  }

  sock.on('message', (msg) => {

    if (msg == 'skip')
    {
      gamestateOneTransition();
    }
    else if (msg == 'reset')
    {
      gamestateZeroTransition();
    }
    else if (msg == 'continue')
    {
      gamestate++;

      
        users.forEach((user) => {
          if(user.name == 'host')
          {
            user.socket.emit('update', 'STOP');
          }	

        });


      if (gamestate ==1)
        gamestateOneTransition();

      if (gamestate ==2)
        gamestateTwoHostTransition();  

      if (gamestate ==3)
        gamestateTwoTransition();  
      if (gamestate ==4)
        gamestateThreeHostTransition();

      if (gamestate ==5)
        gamestateThreeTransition();  

      if (gamestate ==6)
      {
        gamestate = 1;
        gamestateOneTransition(); 
      }
    }
    else
    {
      if(gamestate == 0)
      {
        var person = {
          name: msg.userid,
          def: null,
          choice: null,
          socket: sock
        };

        users[i] = person;
        i++;

        person.socket.emit('message', 'Welcome ' + msg.userid);			
        //io.emit('message', text);
        
      }    
      else if(gamestate == 1)
      {
        users.forEach((user) => {
          if(user.name == msg.userid)
          {
            user.def = msg.msg;
            user.socket.emit('message', msg.msg);
          }	
    
          console.log(users.length);

        });

        var ready = '';
        var flag = 'true';

        users.forEach((user) => {
          if(user.def == null)
          {
            flag = 'false';
          }
        });

      
        if(flag == 'false')
        {      
         ready = 'STOP';
         //ready = ready.fontcolor("red");
        }
        else
        {      
         ready = 'GO';
         //ready = ready.fontcolor("green");
        }

        users.forEach((user) => {
          if(user.name == 'host')
          {
            user.socket.emit('update', ready);
          }	
    
          console.log(users.length);

        });


      }
      else if(gamestate == 3)
      {
        users.forEach((user) => {
          if(user.name == msg.userid)
          {
            user.choice = msg.msg;
            user.socket.emit('message', 'You chose ' + msg.msg);
          }
        });

  
        var ready = '';
        var flag = 'true';

        users.forEach((user) => {
          if(user.choice == null)
          {
            flag = 'false';
          }
        });

      
        if(flag == 'false')
        {      
         ready = 'STOP';
         //ready = ready.fontcolor("red");
        }
        else
        {      
         ready = 'GO';
         //ready = ready.fontcolor("green");
        }

        users.forEach((user) => {
          if(user.name == 'host')
          {
            user.socket.emit('update', ready);
          }	
    
          console.log(users.length);

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
