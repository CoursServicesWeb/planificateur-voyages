import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const token = "rc_live_9552c116e63342c99046697897badbfe";

export const infosPays = axios.create({
  baseURL: "https://api.restcountries.com/countries/v5",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
});
