import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentificationJWT, niveauRequis } from "../middleware/auth.js";
import axios from "axios";
import { infosPays } from "../api/infosPays.js";
import { buildMeta, parsePagination } from "../utils/paginate.js";

const paysRouter = Router();

// La fontion pour récupérer les données d'un pays avec l'API des pays
export async function recupererInfosPays(nomPays: string) {
  try {
    const infos = await infosPays.get(
      `/names.common/${encodeURIComponent(nomPays)}`,
    );
    return infos.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      console.log("Statut HTTP : ", e.response.status);
    } else {
      console.log("Erreur de reseau ou timeout");
    }
    return null;
  }
}

// La fonction qui permet de récupérer les pays qui sont dans la Base de données
paysRouter.get(
  "/liste-pays",
  // authentificationJWT,
  async (req: Request, res: Response) => {
    try {
      const page = Math.max(
        1,
        Number.parseInt(String((req.query.page as string) ?? "1"), 10) || 1,
      );
      const limit = Math.min(
        100,
        Math.max(
          1,
          Number.parseInt(String((req.query.limit as string) ?? "20"), 10) ||
            20,
        ),
      );
      const skip = (page - 1) * limit;
      const take = limit;

      const [total, listePays] = await Promise.all([
        prisma.infosSuppPays.count(),
        prisma.infosSuppPays.findMany({
          orderBy: { countryCode: "asc" },
          skip,
          take,
        }),
      ]);

      if (total === 0) {
        return res
          .status(404)
          .json({ erreur: "Aucun pays dans la base de données" });
      }

      const totalPages = Math.ceil(total / limit);
      return res
        .status(200)
        .json({ data: listePays, meta: { page, limit, total, totalPages } });
    } catch (e) {
      return res
        .status(400)
        .json({ erreur: "Erreur dans la requête des pays." });
    }
  },
);

// La fonction qui permet d'envoyer un pays dans la Base de données
paysRouter.post(
  "/importer/:pays",
  authentificationJWT,
  niveauRequis("Admin"),
  async (req: Request, res: Response) => {
    try {
      const nomPays = req.params.pays as string;

      const { data } = await recupererInfosPays(nomPays);
      if (!data?.objects || data.objects.length === 0) {
        return res
          .status(404)
          .json({ erreur: "Impossible de récupérer les données de l'API" });
      }

      const pays = data.objects[0];

      const infosSupp = await prisma.infosSuppPays.create({
        data: {
          countryCode: pays.codes?.alpha_2 ?? "N/A",
          drapeau_emoji: pays.flag?.url_png ?? "",
          capitale: pays.capitals?.[0]?.name ?? "Inconnue",
          devise: pays.currencies?.[0]?.name ?? "Inconnue",
          langages: pays.languages?.[0]?.name ?? "Inconnu",
        },
      });
      return res.json(infosSupp);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return res.status(500).json({ erreur: "Erreur de serveur." });
      }
    }
  },
);

// La fonction pour modifier les pays dans la Base de données
paysRouter.patch(
  "/:code",
  authentificationJWT,
  niveauRequis("Admin"),
  async (req: Request, res: Response) => {
    const code = req.params.code;
    const { drapeau_emoji, capitale, devise, langages } = req.body;

    try {
      const pays = await prisma.infosSuppPays.update({
        where: { countryCode: String(code) },
        data: {
          drapeau_emoji,
          capitale,
          devise,
          langages,
        },
      });

      return res.json(pays);
    } catch (e: any) {
      if (e?.code === "P2025") {
        // Si l'erreur provient de Prisma
        return res.status(404).json({ erreur: `Pays ${code} n'existe pas` });
      }
      return res.status(500).json({ erreur: "Erreur lors de la mise à jour." });
    }
  },
);

// La fonction qui permet de supprimer un pays dans la Base de données
paysRouter.delete(
  "/:code",
  // authentificationJWT,
  // niveauRequis("Admin"),
  async (req: Request, res: Response) => {
    const code = req.params.code;

    try {
      const pays = await prisma.infosSuppPays.delete({
        where: { countryCode: String(code) },
      });
      return res.json({ message: `Pays ${code} a été supprimé avec succès !` });
    } catch (e) {
      return res.status(404).json({ erreur: `Pays ${code} n'existe pas` });
    }
  },
);

//  SECTION : DESTINATIONS

export default paysRouter;
