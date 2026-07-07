import dotenv from "dotenv";
import express from "express";

import authRouter from "./routes/auth.routes.js";
import paysRouter from "./routes/pays.routes.js";
import voyagesRouter from "./routes/voyages.routes.js";
import etapesRouter from "./routes/etapes.routes.js";
import destinationsRouter from "./routes/destinations.routes.js";
import avisRouteur from "./routes/avis.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

// ---------- Authentification ---------- //
app.use("/auth", authRouter);

// ---------- Pays ---------- //
app.use("/api/pays", paysRouter);

// ---------- Voyages ---------- //
app.use("/voyages", voyagesRouter);

// ---------- Étapes ---------- //
app.use("/etapes", etapesRouter);

// ---------- Destinations ---------- //
app.use("/destinations", destinationsRouter);

// ---------- Avis ---------- //
app.use("/avis", avisRouteur);

app.listen(PORT, () => {
    console.log(`Serveur prêt sur port ${PORT}`);
});