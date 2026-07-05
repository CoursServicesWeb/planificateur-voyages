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

export default destRouter;
