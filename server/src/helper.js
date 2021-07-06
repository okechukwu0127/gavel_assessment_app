const moment = require('moment-timezone');

// HELPER FUNCTIONS

const time = function(date, str){
  if(!date) date = new Date();
  if(!str) str = 'YYYY-MM-DD HH:mm:ss';
  // return date.toLocaleDateString('de-DE', { day: "numeric", month: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  return moment(date).tz('Europe/Vienna').format(str);
}

const log = function(msg, data){
  console.log(time()+": "+msg);
  if(data) console.log(data);
}

const error = function(msg, err){
  log('ERROR '+msg, err);
}

const count = function(obj){
  return Object.keys(obj).length;
}

// MODULE INTERACTION

module.exports = {
  log, error, time, count
}