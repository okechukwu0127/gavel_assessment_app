const { ip, name } = require('../../env.json');
const { log, error, time, count } = require('./helper.js');

// SOCKET.IO

// A small hint to check this out: https://socket.io/docs/v4/emit-cheatsheet/
const Socketio = require('socket.io');
let socketio = null; // established on listen() at the bottom

// STORE

let users = ['tobi', 'byron', 'kay', 'bryce', 'marco', 'maria', 'sarah', 'kevin', 'paulo', 'hubert'];
let messages = []; 

const getRandomUser = () => {
  const simulating_a_new_user = Math.floor( Math.random() * users.length );
  return {
    id: simulating_a_new_user,
    name: users[simulating_a_new_user],
    // pic: 'http://'+ip+':3000/cats/Cat_'+simulating_a_new_user+'.png',
    pic: 'http://'+ip+':3000/dogs/Dog_'+simulating_a_new_user+'.png',
  }
}

// INIT

const onHi = (socket, data) => {
  if(socket.user){
    log('io onHi again '+socket.user.name+' #'+socket.user.id);
  }
  else {
    socket.user = getRandomUser();
    if(data?.name) socket.user.name = data.name; // overwrite with real name, if given

    log('io onHi '+socket.user.name+' (#'+socket.user.id+')');

    socket.emit('init', {'registered': true});
    socketio.sockets.emit('hi', socket.user);
  }
}

// BYE

const onBye = (socket) => {
  if(socket.user) {
    log('io onBye '+socket.user.name+' #'+socket.user.id);
    
    socketio.sockets.emit('bye', socket.user);
  }
  else {
    log('io onBye stranger');
  }
};

// CHAT

const onMessage = (socket, data) => {

  if(data.random){
    data.user = getRandomUser();
  }
  
  if(data.user || socket.user) {
    log('io onMessage from '+(data.user?.name || socket.user.name)+': '+data.text.slice(0,10));

    let message = {
      'user': data.user || socket.user,
      'text': data.text,
      'time': (new Date()).getTime(),
      'random': data.random ? true : false
    }
    // messages.unshift(message); // if you want to turn it upside down in frontend, you can do it here as well
    messages.push(message);

    socketio.sockets.emit('message', message);
  }
  else {
    error('io onMessage (user not registered in socket): '+data.text);
  }
};

// ERRORS

const onAny = (socket, data) => {
  log('io onAny', data);
}

const onError = (err) => {
  error('io onError', err);
}

// NEW SOCKET.IO CONNECTIONS

const listen = (server, cors, callback) => {  
  log('io starting');

  socketio = Socketio(server, { 'cors': cors, 'path': '/io' });

  let first = true;

  socketio.on('connection', (socket) => {
    if(first){
      log('io started (first connection established)');
      first = null;
    }
    
    log('io connection id='+socket.id);

    socket.on('hi', (data) => onHi(socket, data) );
    socket.on('message', (data) => onMessage(socket, data) );
    socket.on('disconnect', () => onBye(socket) );
    // socket.onAny((data)=> onAny(socket, data) ); 
  });

  socketio.on("connection_error", (err) => onError(err) );

  log('io listening');
  if(typeof callback == 'function') callback();
};

// MODULE INTERACTION

const io = {
  'listen': listen,
};

module.exports = {
  io
}
