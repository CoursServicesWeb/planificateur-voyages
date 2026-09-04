import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Le token qui nous donne accès à l'API
const token = process.env.REST_COUNTRIES_API_KEY || "rc_live_demo";

// L'instance d'Axios qui nous permet d'accéder à l'API des infos supplémantaires du pays
export const infosPays = axios.create({
  baseURL: "https://api.restcountries.com/countries/v5",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
});
