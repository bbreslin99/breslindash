var cont = 'false';

const updateEvent = (text) => {
 
  if(text == 'GO')
  {
    cont = 'true';
    text = text.fontcolor("green");
  }
  else if(text == 'STOP')
  {
    cont = 'false';
    text = text.fontcolor("red");
  }
  else
  {
    text = text;
  }

  //p = document.querySelector('#events');
	//p.textContent = '';

  // <ul> element
  const parent = document.querySelector('#updates');

  parent.textContent = '';

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};


const writeEvent = (text) => {
 
  if (text == 'z')
  {
    i = 0;

    var element = document.getElementById("continue");
    //element.parentNode.removeChild(element);
    element.style.display = "none";

    element = document.getElementById("skip");
    //element.parentNode.removeChild(element);
    element.style.display = "none";

    element = document.getElementById("reset");
    //element.parentNode.removeChild(element);
    element.style.display = "none";
  
    return;
  }

  //p = document.querySelector('#events');
	//p.textContent = '';

  // <ul> element
  const parent = document.querySelector('#events');

  parent.textContent = '';

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};

const sock = io();
var name;
var i = 0;


const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#name');
  const text = input.value;
  input.value = '';

  if(i == 0)
  {
    name = text;
    i++;

    if(name == 'host')
    {
      var element = document.getElementById("continue");
      //element.parentNode.removeChild(element);
      element.style.display = "block";

      element = document.getElementById("skip");
      //element.parentNode.removeChild(element);
      element.style.display = "block";

      element = document.getElementById("reset");
      //element.parentNode.removeChild(element);
      element.style.display = "block";
    }
  }
  
  var fullmsg = {  
    userid : name,  
    msg : text
    };  

  sock.emit('message', fullmsg);
};




  //document
  //.querySelector('#name-form')
  //.removeEventListener('submit', onFormSubmitted);

  var element = document.getElementById("continue");
  //element.parentNode.removeChild(element);
  element.style.display = "none";

  element = document.getElementById("skip");
  //element.parentNode.removeChild(element);
  element.style.display = "none";

  element = document.getElementById("reset");
  //element.parentNode.removeChild(element);
  element.style.display = "none";
 
writeEvent('Welcome to Breslindash <BR/> <BR/> Enter Name');




sock.on('message', writeEvent);

sock.on('update', updateEvent);




document
  .querySelector('#name-form')
  .addEventListener('submit', onFormSubmitted);

const button = document.getElementById('continue');
button.addEventListener('click', () => {
  if(cont == 'true')
    sock.emit('message', 'continue');
  else
  {
      var r = confirm("Are you sure you want to continue?");
      if (r == true) 
        sock.emit('message', 'continue');
  }


});

const button2 = document.getElementById('skip');
button2.addEventListener('click', () => {
  sock.emit('message', 'skip');
});

const button3 = document.getElementById('reset');
button3.addEventListener('click', () => {
  sock.emit('message', 'reset');
});



//addButtonListeners();
