import ENV from './env';

export function isEmail(email:string|undefined) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9])+$/;
  return email && regex.test(email) ? true : false;
}

export function isPhone(phone:string|undefined) {
  var regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  return phone && regex.test(phone) ? true : false;
}

export function isName(name:string|undefined) {
  var regex = /^([a-zA-Z\x80-\xFF\-\.\ ]){3,30}$/;
  return name && regex.test(name) ? true : false;
}

export function isUsername(username:string|undefined) {
  var regex = /^([a-zA-Z0-9_\-\.\ ]){3,15}$/;
  return username && regex.test(username) ? true : false;
}

export function has(param:any){
  return (typeof param != 'undefined');
}

export function log(msg:any, ...msgs:any){
  if(ENV.DEBUG) {
    console.log(msg, ...msgs); // time()+": "+
    // for (let data of msgs){
    //   if(typeof data == 'object') console.dir(data);
    //   else console.log(data);
    // }
  }
}

export function error(msg:any, err?:any, ...msgs:any){
  log('ERROR '+msg, err, msgs);
}