import axios from 'axios';
//import { PORT } from "../../../node/config.js";



const URI = `http://${window.location.hostname}:8000`; // para localhost sacar la 's', y agragar el puerto: 8000



export const Api = axios.create({
    baseURL: URI
});