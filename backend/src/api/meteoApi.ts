import axios from "axios";

// Instance Axios pour accéder à l'API météo
export const meteoApi = axios.create({
    baseURL: "https://api.open-meteo.com/v1",
    timeout: 10000,
});