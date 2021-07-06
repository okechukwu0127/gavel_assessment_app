import { ip as IP, name as NAME} from "../../env.json";

const ENV:string = 'dev'; 

let DEBUG = ENV==='dev' ? true : false;
// DEBUG=false;

const URL = {
  'prod': 'https://letsgavel.com',
  'dev':  'http://'+IP+':3000',
}
[ENV];

export default {
  'DEBUG': DEBUG,
  'BACKEND_URL': URL,
  'IP': IP,
  'NAME': NAME,
}

// use .env file with type definitions from ../types/env.d.ts
// import { APP_VERSION, IO_URL } from 'react-native-dotenv';

// other way: https://dev.to/calintamas/how-to-manage-staging-and-production-environments-in-a-react-native-app-4naa