import dotenv from "dotenv";
import express from "express";

import authRouter from "./routes/auth.routes.js";
import voyagesRouter from "./routes/voyages.routes.js";
import etapesRouter from "./routes/etapes.routes.js";
import paysRouter from "./routes/pays.routes.js";
import destinationsRouter from "./routes/destinations.routes.js";
import avisRouteur from "./routes/avis.routes.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: [
      "https://planificateur-voyages-backend.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// ---------- Authentification --------------------- //
app.use("/auth", authRouter);

// ---------- Voyages ------------------------------ //
app.use("/voyages", voyagesRouter);

// ---------- Étapes ------------------------------- //
app.use("/etapes", etapesRouter);

// ---------- Destinations ------------------------- //
app.use("/destinations", destinationsRouter);

// ---------- Pays --------------------------------- //
app.use("/pays", paysRouter);

// ---------- Avis --------------------------------- //
app.use("/avis", avisRouteur);

/*app.listen(PORT, () => {
  console.log(`Serveur prêt sur port ${PORT}`);
});*/
export default app;
