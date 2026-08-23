import axios from "axios";

// On crée l'instance axios
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 1000,
})
