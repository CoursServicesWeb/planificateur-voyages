import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Le token qui nous donne accès à l'API
const token = "rc_live_59b2d37cb4a848a5b4c3b8d22014e8b5";

// L'instance d'Axios qui nous permet d'accéder à l'API des infos supplémantaires du pays
export const infosPays = axios.create({
  baseURL: "https://api.restcountries.com/countries/v5",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
});
