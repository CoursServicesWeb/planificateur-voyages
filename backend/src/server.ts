import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import authRouter from "./routes/auth.routes.js";
import paysRouter from "./routes/pays.routes.js";
import etapesRouter from "./routes/etapes.routes.js";
import voyagesRouter from "./routes/voyages.routes.js";
import destinationsRouter from "./routes/destinations.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/api/pays", paysRouter); // N'oubliez pas d'enregistrer le nouveau routeur !
app.use("/etapes", etapesRouter);
app.use("/voyages", voyagesRouter);
app.use("/destinations", destinationsRouter);

app.listen(PORT, () => {
  console.log(`Serveur prêt sur port ${PORT}`);
});
