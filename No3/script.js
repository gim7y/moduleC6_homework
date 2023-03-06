const wsUri = 'wss://echo-ws-service.herokuapp.com';

const message = document.querySelector('.messageIn');
const btnSend = document.querySelector('.btn-send');
const btnGeo = document.querySelector('.btn-geo');
const chatField = document.querySelector('.chatField')

function setInChatField(message, flag) {
    let div = document.createElement('div');

    if(flag === 'cli') {
    	div.classList.add('message', 'cli-message');
    } else if(flag === 'serv' || flag === 'geo') {
    	div.classList.add('message', 'serv-message');
    }
    div.innerHTML = message;
    chatField.prepend(div);
    message.scrollTop += 20
   
    document.querySelector('.messageIn').value = '';
}

const error = () => {
    setInChatField('Невозможно получить ваше местоположение', 'serv');
}

const success = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setInChatField(`Широта: ${latitude} °, Долгота: ${longitude} °`, 'server');
    setInChatField(`<a href = 'https://www.openstreetmap.org/#map=18/${latitude}/${longitude}' target="_blank">Ваша геолокация</a>`, 'serv')
}

document.addEventListener('DOMContentLoaded', () => {
    let textOut = message.value;
    websocket = new WebSocket(wsUri);

    websocket.onopen = function(evt) {
        console.log(websocket.readyState);
        // let message = websocket.send("Привет всем!");
    }
    websocket.onmessage = function(evt) {
        setInChatField(`<span>${evt.data} </span>`, 'serv');
    }
    websocket.onerror = function(evt) {
 		setInChatField(('<span style = "color: red;">ERROR:</span> ' + evt.data), 'serv')
 	}
    websocket.onclose = function(evt) {
    	let label = 'Соединение разорвано. При необходимости перезагрузите страницу'
    	console.log('Error occurred');
    	label.innerHTML = `Error: , ${label}`;
    	setInChatField(`<span style="color: red;">Error: ${label}</span>`, 'serv');
  	}
});

btnSend.addEventListener('click', () => {
  let textOut = message.value;
  setInChatField(`${textOut}`, 'cli');
  websocket.send(textOut);
})

btnGeo.addEventListener('click', () => {
  let textOut = 'Геолокация';
  setInChatField(textOut, 'cli');
  navigator.geolocation.getCurrentPosition(success, error);
})