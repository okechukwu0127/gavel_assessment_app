const { log } = require('./src/helper.js');
const { ip, name } = require('../env.json');

if(ip && name) {

  // GAVEL ENGINE
  // const { server, app, cors } = require('./src/core.js');
  const { app, cors } = require('./src/core.js');
  const { io } = require('./src/io.js');
  const { api } = require('./src/api.js');

  // STARTUP
  const server = app.listen(3000, () => {
    log('app listening');
    startup();
  });

  const startup = () => {
    io.listen( server, cors, () => { // pass raw http server created by express.js to socket.io
      api.listen( app, () => {
        log('gavel listening\n');
        
        log('you can now start the ios/android app');
        log('click here to see instructions: http://'+( ip || 'localhost' )+':3000\n');

        log(name+', we wish you a lot of fun!\n');
      });
    });
  }

} else {
  log( 'please add your name and change your ip in the file ./env.json' );
}