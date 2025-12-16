import axios from "axios";
//import stateService from './state-service';

const api = axios.create({
  baseURL: "http://192.168.0.105:3000/api",
  //baseURL: 'https://gamestreet-api.azurewebsites.net/api',
  headers: {
    //'Authorization': `Bearer ${stateService.auth?.Token}`,
    "Content-Type": "application/json",
  },
});

export default api;
