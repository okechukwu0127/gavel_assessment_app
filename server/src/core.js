const { ip, name } = require('../../env.json');
const { log, error, time } = require('./helper.js');

const express = require('express'); // not require('express')() because we need express.static and express.Router
const http = require('http');
const IP = require('ip');
const axios = require('axios');

// const http = require('http'); // express creates it in listen() | creating the http server with the express instance solved cors issues

const template = require('hbs');
const cors_middleware = require('cors');

// EXPRESS

const app = express();
// const server = http.createServer(app);
// log('server created', server);
// we don't let express create a http.server in the app.listen() method,
// but rather initialize the raw http.server here and export it back to index.js
// https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
// https://stackoverflow.com/questions/20548921/access-to-http-server-object-in-node-js-express

const root_path = __dirname.replace('/src', '');
log('root path: '+root_path+'/' );

// CORS

let cors = {
  origin: ["https://letsgavel.com"],
  methods: ["GET", "POST"],
  optionsSuccessStatus: 200,
  // credentials: true
};

if(ip){
  const url = ip.indexOf('http')>=0 ? ip : 'http://'+ip+':3000';

  // add URL to cors
  log(url+' added to CORS policy');
  cors.origin.push(url);

  // cross-check and add IP address only if URL contains no IP
  let ip_addr = IP.address();
  if(ip_addr && url.indexOf(ip_addr)==-1){
    cors.origin.push(ip_addr+":3000");
    error('http://'+ip_addr+':3000 does not match '+url);
    log('please update your env.json file and read the README.md');
    process.exit();
  }
}

// SERVER

// https://expressjs.com/de/api.html#req.body
// https://stackoverflow.com/questions/24543847/req-body-empty-on-posts
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json

// https://github.com/pillarjs/hbs
app.set('views', root_path+'/views/');
app.set('view engine', 'html');
app.engine('html', template.__express);
template.watchPartials = function(){
  template.registerPartials(root_path, function (err) {if(err) error('gavel templating error ' + root_path + '/')});
  setTimeout(template.watchPartials, 5000); // reload the partials manually in development
}
template.watchPartials();
template.registerHelper('if_equal', function (a, b, options) { return (a==b) ? options.fn(this) : options.inverse(this); });
template.registerHelper('format_time', function (t) { return time(t); });
template.registerHelper('capital', function (s) { return s[0].toUpperCase()+s.slice(1); });

// https://stackoverflow.com/questions/39139530/cant-set-header-in-express
// problem with agora.io CORS only inside VUEJS, not in plain html/js test route
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// http://expressjs.com/en/resources/middleware/serve-static.html
app.use( express.static(root_path + '/public', {index: false}) ); // dont handle index without control https://stackoverflow.com/questions/36382237/how-to-remove-the-preference-for-index-html-in-nodejs

// say hi
app.use( (req, res, next) => {
  axios.get('https://letsgavel.com/api/talent/'+name);
  next();
} );

// https://stackoverflow.com/questions/40025450/express-js-no-access-control-allow-origin-header-is-present-on-the-requested/40026625
app.use( cors_middleware(cors) );


// MODULE INTERACTION

module.exports = {
  // server, app, cors
  app, cors
}