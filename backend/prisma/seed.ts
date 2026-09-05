import {
  Role,
  StatutVoyage,
  TypeHebergement,
  Continent,
} from "../generated/prisma/enums.js";
import prisma from "../src/utils/prisma.js";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Démarrage du seed...");

  // Nettoyage (ordre important à cause des relations)
  await prisma.avis.deleteMany();
  await prisma.etape.deleteMany();
  await prisma.voyage.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.infosSuppPays.deleteMany();
  await prisma.utilisateur.deleteMany();

  // --- Infos supplémentaires pays ---
  const france = await prisma.infosSuppPays.create({
    data: {
      countryCode: "FR",
      drapeau_emoji: "https://flags.restcountries.com/v5/w640/fr.png",
      capitale: "Paris",
      devise: "Euro",
      langages: "Francais",
    },
  });

  const japon = await prisma.infosSuppPays.create({
    data: {
      countryCode: "JP",
      drapeau_emoji: "https://flags.restcountries.com/v5/w640/jp.png",
      capitale: "Tokyo",
      devise: "Yen",
      langages: "Japonais",
    },
  });

  const bresil = await prisma.infosSuppPays.create({
    data: {
      countryCode: "BR",
      drapeau_emoji: "https://flags.restcountries.com/v5/w640/br.png",
      capitale: "Brasilia",
      devise: "Real",
      langages: "Portugais",
    },
  });

  const canada = await prisma.infosSuppPays.create({
    data: {
      countryCode: "CA",
      drapeau_emoji: "https://flags.restcountries.com/v5/w640/ca.png",
      capitale: "Ottawa",
      devise: "Dollar canadien",
      langages: "Francais, Anglais",
    },
  });

  // --- Destinations ---
  const paris = await prisma.destination.create({
    data: {
      ville: "Paris",
      continent: Continent.Europe,
      lat: 48.8566,
      long: 2.3522,
      infoSuppPaysId: france.countryCode,
    },
  });

  const tokyo = await prisma.destination.create({
    data: {
      ville: "Tokyo",
      continent: Continent.Asie,
      lat: 35.6762,
      long: 139.6503,
      infoSuppPaysId: japon.countryCode,
    },
  });

  const riodejaneiro = await prisma.destination.create({
    data: {
      ville: "Rio de Janeiro",
      continent: Continent.Amerique,
      lat: -22.9068,
      long: -43.1729,
      infoSuppPaysId: bresil.countryCode,
    },
  });

  const quebec = await prisma.destination.create({
    data: {
      ville: "Québec",
      continent: Continent.Amerique,
      lat: 46.8139,
      long: -71.208,
      infoSuppPaysId: canada.countryCode,
    },
  });

  // --- Utilisateurs ---
  const motDePasseHash = await hash("MotDePasse123!", 10);

  const admin = await prisma.utilisateur.create({
    data: {
      courriel: "admin@voyages.com",
      motDePasse: motDePasseHash,
      nom: "Tremblay",
      prenom: "Julie",
      role: Role.Admin,
    },
  });

  const voyageur1 = await prisma.utilisateur.create({
    data: {
      courriel: "marc.gagnon@example.com",
      motDePasse: motDePasseHash,
      nom: "Gagnon",
      prenom: "Marc",
      role: Role.Voyageur,
    },
  });

  const voyageur2 = await prisma.utilisateur.create({
    data: {
      courriel: "sophie.leblanc@example.com",
      motDePasse: motDePasseHash,
      nom: "Leblanc",
      prenom: "Sophie",
      role: Role.Voyageur,
    },
  });

  // --- Voyages ---
  const voyageEurope = await prisma.voyage.create({
    data: {
      titre: "Escapade européenne",
      dateDeb: new Date("2026-06-01"),
      dateFin: new Date("2026-06-15"),
      statut: StatutVoyage.Planifie,
      utilisateurId: voyageur1.id,
    },
  });

  const voyageAsie = await prisma.voyage.create({
    data: {
      titre: "Découverte du Japon",
      dateDeb: new Date("2025-11-10"),
      dateFin: new Date("2025-11-25"),
      statut: StatutVoyage.Termine,
      utilisateurId: voyageur2.id,
    },
  });

  const voyageAmerique = await prisma.voyage.create({
    data: {
      titre: "Amérique en cours",
      dateDeb: new Date("2026-08-01"),
      dateFin: new Date("2026-08-20"),
      statut: StatutVoyage.En_cours,
      utilisateurId: voyageur1.id,
    },
  });

  // --- Étapes ---
  await prisma.etape.create({
    data: {
      dateDeb: new Date("2026-06-01"),
      dateFin: new Date("2026-06-05"),
      notes: "Visite de la Tour Eiffel et du Louvre.",
      hebergement: TypeHebergement.Hotel,
      voyageId: voyageEurope.id,
      destinationId: paris.id,
    },
  });

  await prisma.etape.create({
    data: {
      dateDeb: new Date("2025-11-10"),
      dateFin: new Date("2025-11-18"),
      notes: "Séjour à Shibuya, quartier animé.",
      hebergement: TypeHebergement.AirBnB,
      voyageId: voyageAsie.id,
      destinationId: tokyo.id,
    },
  });

  await prisma.etape.create({
    data: {
      dateDeb: new Date("2026-08-01"),
      dateFin: new Date("2026-08-10"),
      notes: "Carnaval hors saison, plage de Copacabana.",
      hebergement: TypeHebergement.Tout_inclus,
      voyageId: voyageAmerique.id,
      destinationId: riodejaneiro.id,
    },
  });

  await prisma.etape.create({
    data: {
      dateDeb: new Date("2026-08-11"),
      dateFin: new Date("2026-08-20"),
      notes: "Visite chez des amis à Québec.",
      hebergement: TypeHebergement.Amis_Famille,
      voyageId: voyageAmerique.id,
      destinationId: quebec.id,
    },
  });

  // --- Avis ---
  await prisma.avis.create({
    data: {
      nom: "Marc Gagnon",
      nbEtoiles: 5,
      commentaire: "Paris est magnifique, à refaire sans hésiter !",
      destinationId: paris.id,
    },
  });

  await prisma.avis.create({
    data: {
      nom: "Sophie Leblanc",
      nbEtoiles: 4,
      commentaire: "Tokyo est fascinant, la culture est incroyable.",
      destinationId: tokyo.id,
    },
  });

  await prisma.avis.create({
    data: {
      nom: "Julie Tremblay",
      nbEtoiles: 5,
      commentaire: "Rio a une énergie unique, les plages sont superbes.",
      destinationId: riodejaneiro.id,
    },
  });

  await prisma.avis.create({
    data: {
      nom: "Marc Gagnon",
      nbEtoiles: 3,
      commentaire: "Québec est charmant mais assez froid en hiver.",
      destinationId: quebec.id,
    },
  });

  console.log("✅ Seed terminé avec succès !");
  console.log({
    admin: admin.courriel,
    voyageur1: voyageur1.courriel,
    voyageur2: voyageur2.courriel,
  });
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
