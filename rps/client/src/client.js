const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

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
 
writeEvent('Welcome to Dictionary Dash');
writeEvent('Enter Name');

sock.on('message', writeEvent);

document
  .querySelector('#name-form')
  .addEventListener('submit', onFormSubmitted);

const button = document.getElementById('continue');
button.addEventListener('click', () => {
  sock.emit('message', 'continue');
});
//addButtonListeners();