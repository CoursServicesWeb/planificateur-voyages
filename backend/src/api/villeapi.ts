import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// L'instance d'Axios qui nous permet d'accéder à l'API pour les coordonnées des destinations
export const villeapi = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
  timeout: 10000,
});
