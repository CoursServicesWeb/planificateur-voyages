import { Router, type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";
import { authentificationJWT, niveauRequis } from "../../middleware/auth.js";
import axios from "axios";
import { villeapi } from "../../api/villeapi.js";
import { count } from "node:console";
import type { format } from "node:path";
import { recupererInfosPays } from "../../routes/pays.routes.js";
import destinationsRouter from "../../routes/destinations.routes.js";
import { buildMeta, parsePagination } from "../../utils/paginate.js";
import { type Continent } from "../../../../shared/types/destination.js";

// La fonction pour récupérer le country code, la longitude et la latitude avec une APIT
async function getInfosVille(nomVille: string) {
  try {
    const { data } = await villeapi.get("/search", {
      params: {
        name: nomVille,
        count: 10,
        language: "en",
        format: "json",
      },
    });

    if (!data?.results || data.results.length === 0) {
      return null;
    }

    return {
      infoSuppPaysId: data.results[0].country_code
        ? data.results[0].country_code.toUpperCase()
        : "N/A",
      lat: data.results[0].latitude,
      long: data.results[0].longitude,
      nomPays: data.results[0].country,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      console.log("Statut HTTP : ", e.response.status);
    } else {
      console.log("Erreur de reseau ou timeout");
    }
    return null;
  }
}

// La fonction pour ajouter une Destination en appelant les 2 API pour les infos supplémentaires
export async function creerDestination(req: Request, res: Response) {
  try {
    const { ville, continent } = req.body;

    if (!ville) {
      return res.status(400).json({ erreur: "Aucune ville déclarée." });
    }

    const continentsValides = [
      "Amerique",
      "Europe",
      "Asie",
      "Afrique",
      "Oceanie",
    ];

    if (!continentsValides.includes(continent)) {
      return res
        .status(400)
        .json({ erreur: "Veuillez entrer un continent valide." });
    }

    const infos = await getInfosVille(ville); // On récupère les infos sur la ville avec la fonction précédente
    if (!infos) {
      return res.status(404).json({
        erreur: "Les données sur la destination n'ont pas pu être récupérées.",
      });
    }

    const { infoSuppPaysId, lat, long, nomPays } = infos;

    let infossuppPresentes = await prisma.infosSuppPays.findUnique({
      // On essaie de trouver les infos sur le pays dans notre Base de données
      where: { countryCode: infoSuppPaysId },
    });

    if (!infossuppPresentes) {
      const donneesPays = await recupererInfosPays(nomPays); // Si les données sur le pays ne sont pas dans notre base, on va les cherche dans l'API

      if (
        donneesPays.data &&
        donneesPays.data.objects &&
        donneesPays.data.objects.length > 0
      ) {
        const pays = donneesPays.data.objects[0];

        await prisma.infosSuppPays.create({
          data: {
            countryCode: pays.codes?.alpha_2 ?? "N/A",
            drapeau_emoji: pays.flag?.url_png ?? "",
            capitale: pays.capitals?.[0]?.name ?? "Inconnue",
            devise: pays.currencies?.[0]?.name ?? "Inconnue",
            langages: pays.languages?.[0]?.name ?? "Inconnu",
          },
        });
      } else {
        // Si l'API des pays ne fonctionne, on permet quand même la création d'une destination en mettant des infos par défaut
        await prisma.infosSuppPays.create({
          data: {
            countryCode: infoSuppPaysId,
            drapeau_emoji: "",
            capitale: "Inconnue",
            devise: "Inconnue",
            langages: "Inconnu",
          },
        });
      }
    }

    const destination = await prisma.destination.create({
      data: {
        ville: ville,
        continent: continent,
        lat: lat,
        long: long,
        infoSuppPaysId: infoSuppPaysId,
      },
    });

    return res.status(201).json(destination);
  } catch (e) {
    return res.status(500).json({ erreur: "Erreur de serveur." });
  }
}

// La fonction pour obtenir toutes les destinations
export async function getDestinations(req: Request, res: Response) {
  try {
    const { page, limit, skip, take } = parsePagination(req.query); // Dans le query, on spécifie la pagination

    const [total, destinations] = await Promise.all([
      prisma.destination.count(),
      prisma.destination.findMany({
        orderBy: { id: "asc" },
        skip,
        take,
      }),
    ]);

    const meta = buildMeta(page, limit, total);
    return res.status(200).json({ data: destinations, meta });
  } catch (e) {
    res.status(400).json({ erreur: "La requête n'a pas fonctionné." });
  }
}

// La fonction pour filtrer les destinations par continent
export async function getByContinent(req: Request, res: Response) {
  const continent = req.query.continent as Continent;
  if (!continent) {
    return res.status(400).json({ erreur: "Vous devez donner un continent." });
  }

  const continentsValides: Continent[] = [
    "Asie",
    "Afrique",
    "Amerique",
    "Europe",
    "Oceanie",
  ];

  if (!continentsValides.includes(continent)) {
    return res
      .status(400)
      .json({ erreur: "Le continent donné n'est pas valide." });
  }
  try {
    const { page, limit, skip, take } = parsePagination(req.query);

    const [total, destContinent] = await Promise.all([
      prisma.destination.count({ where: { continent } }),
      prisma.destination.findMany({
        where: { continent },
        skip,
        take,
      }),
    ]);

    const meta = buildMeta(page, limit, total);

    return res.status(200).json({ data: destContinent, meta });
  } catch (e) {
    return res.status(500).json({ erreur: "Erreur de serveur." });
  }
}

// La fonction pour afficher une destination en particulier, avec la note moyenne de ses avis et la liste d'avis

export async function getDestinationById(req: Request, res: Response) {
  const id = Number(req.params.id) || null;

  if (!id) {
    return res.status(400).json({ erreur: "Vous devez entrer un ID valide." });
  }

  try {
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return res
        .status(404)
        .json({ message: "La destination n'a pas été trouvée." });
    }

    const listeAvis = await prisma.avis.findMany({
      where: { destinationId: id },
    });

    const noteMoyenne = await prisma.avis.aggregate({
      where: { destinationId: id },
      _avg: {
        nbEtoiles: true,
      },
    });

    return res.status(200).json({ destination, listeAvis, noteMoyenne });
  } catch (e) {
    return res.status(500).json({ erreur: "Erreur de serveur." });
  }
}

// La fonction pour modifer une destination
export async function modifierDestination(req: Request, res: Response) {
  const id = Number(req.params.id) || null;

  const { ville, continent, infoSuppPaysId } = req.body;

  if (!id) {
    return res.status(400).json({ erreur: "Vous devez entrer un ID valide." });
  }

  try {
    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ville,
        continent,
        infoSuppPaysId,
      },
    });
    return res.status(200).json(destination);
  } catch (e) {
    res.status(404).json({ erreur: "Destination n'existe pas" });
  }
}

// La fonction pour supprimer une destination dans la table
export async function supprimerDestination(req: Request, res: Response) {
  const id = Number(req.params.id) || null;

  if (!id) {
    return res.status(400).json({ erreur: "Veuillez entrer un ID valide." });
  }

  try {
    const destination = await prisma.destination.delete({
      where: { id },
    });
    return res.status(200).json({
      message: `Destination ${destination.ville} supprimée avec succès`,
    });
  } catch (e) {
    return res.status(404).json({ erreur: "La destination n'existe pas" });
  }
}
