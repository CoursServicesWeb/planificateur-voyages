import axios from "axios";
import prisma from "../utils/prisma.js";

// Instance Axios pour accéder à l'API météo
export const meteoApi = axios.create({
    baseURL: "https://api.open-meteo.com/v1",
    timeout: 10000,
});

export async function recupererMeteo(etapes: Array<object>) {
    
    // Les données météo dans des listes inbriquées, avec les listes extérieures
    // ayant une clé correspondante au DestinationId.
    // Les listes inbriquées traitent les cas où une même destination est répétée plusieurs
    // fois dans un voyage
    const meteoParDestination: Map<number,Array<Array<Meteo>>> = new Map();

    const promises = etapes.map(async etape =>{
        try {
            // Extraire les données de la destination d'une étape pour le API open-météo et
            // le résultat final
            const destination = await prisma.destination.findUnique({
                where: {
                    id:(etape as any).destinationId
                },
                select: {
                    id:true,
                    ville:true,
                    lat:true,
                    long:true
                }
            })
            // Si une clé n'existe pas pour cette destination, en créer une et 
            // initialiser une liste vide
            if (destination?.id && !(meteoParDestination.has(destination.id))) {
                meteoParDestination.set(destination?.id,[]);
            }
            // Obtenir les données météo par latitude et longitude, pour la durée de l'étape
            const { data } = await meteoApi.get('/forecast?',{
                params:{
                    latitude:`${destination?.lat}`,
                    longitude:`${destination?.long}`,
                    daily:"weather_code,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max",
                    timezone:"auto",
                    start_date:(etape as any).dateDeb.toISOString().split('T')[0],
                    end_date:  (etape as any).dateFin.toISOString().split('T')[0]
                }
            })
            // Copie des dates des données pour un forEach car la liste originale sera consommée
            const datesPrevisionCopie: string[] = [...data.daily.time]
            // Liste d'objets Meteo avec données par jour, pour une destination
            const previsionDestination: Meteo[] = new Array();
            // Pour chaque date de prévision, consommer les données en les emballant dans des objets Meteo
            // qui sont insérés dans la liste
            datesPrevisionCopie.forEach( () => {
                previsionDestination.push(
                    {
                        date: data.daily.time.shift(),
                        temp_max: Math.round(data.daily.apparent_temperature_max.shift()),
                        temp_min: Math.round(data.daily.apparent_temperature_min.shift()),
                        sunrise: data.daily.sunrise.shift(),
                        sunset: data.daily.sunset.shift(),
                        uv_index: data.daily.uv_index_max.shift(),
                        description: codesWMO[data.daily.weather_code.shift()] as any
                    }
                )

            })
            // Insérer la liste d'objets Meteo dans le Map à la clé de destinationId
            meteoParDestination.get(destination!.id)?.push(previsionDestination)
            return
            
        } catch(err){
            throw err
        }
        
    })

    await Promise.all(promises)

    return meteoParDestination
}
// Mapping de codes WMO à une description des conditions météorologiques
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
// Declaration type Meteo
export type Meteo = {
    date: string;
    temp_max: number,
    temp_min: number,
    sunrise: string,
    sunset: string,
    uv_index: number,
    description: string
}