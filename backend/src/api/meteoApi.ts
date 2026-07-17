import axios from "axios";

// Instance Axios pour accéder à l'API météo
export const meteoApi = axios.create({
    baseURL: "https://api.open-meteo.com/v1",
    timeout: 10000,
});

export const codesWMO: Record<number,string> = {
    0:"ciel clair",
    1:"ciel plutôt clair",
    2:"ciel partiellement couvert",
    3:"ciel couvert",
    45:"brouillard",
    48:"brouillard givrant",
    51:"pluie fine légère",
    53:"pluie fine moyenne",
    55:"pluie fine dense",
    56:"pluie fine givrante légère",
    57:"pluie fine givrante dense",
    61:"pluie légère",
    63:"pluie moyenne",
    65:"pluie intense",
    66:"pluie verglaçante légère",
    67:"pluie verglaçante intense",
    71:"neige légère",
    73:"neige moyenne",
    75:"neige intense",
    77:"neige en grains",
    80:"averses de pluie légères",
    81:"averses de pluie moyennes",
    82:"averses de pluie violentes",
    85:"averses de neige légères",
    86:"averses de neige lourdes",
    95:"orage",
    96:"orage accompagnés de grêle légère",
    99:"orage accompagnés de grêle intense"
}

export type Meteo = {
    date: string;
    temp_max: number,
    temp_min: number,
    sunrise: string,
    sunset: string,
    uv_index: number,
    description: string
}