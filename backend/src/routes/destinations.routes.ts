import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentificationJWT, niveauRequis } from "../middleware/auth.js";
import axios from "axios";
import { infosPays } from "../api/infosPays.js";

const destRouter = Router();

async function recupererInfosPays(nomPays: string) {
  try {
    const infos = await infosPays.get(`/names.common/${nomPays}`);
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

destRouter.get("/test-pays/:pays", async (req: Request, res: Response) => {
  try {
    const nomPays = req.params.pays as string;

    const donneesPays = await recupererInfosPays(nomPays);

    if (!donneesPays) {
      return res
        .status(404)
        .json({ erreur: "Impossible de récupérer les données de l'API" });
    }
    return res.json(donneesPays);
  } catch (e) {
    return res.status(500).json({ erreur: "Erreur lors du test de la route" });
  }
});

destRouter.post(
  "/importer/:pays",
  authentificationJWT,
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
          countryCode: pays.codes?.alpha_3 ?? "N/A",
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

export default destRouter;
