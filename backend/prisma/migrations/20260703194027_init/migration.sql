-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Voyageur', 'Admin');

-- CreateEnum
CREATE TYPE "StatutVoyage" AS ENUM ('Planifie', 'En_cours', 'Termine');

-- CreateEnum
CREATE TYPE "TypeHebergement" AS ENUM ('Hotel', 'Motel', 'AirBnB', 'Auberge', 'Tout_inclus', 'Camping', 'Amis_Famille');

-- CreateEnum
CREATE TYPE "Continent" AS ENUM ('Asie', 'Afrique', 'Amerique', 'Europe', 'Oceanie');

-- CreateTable
CREATE TABLE "InfosSuppPays" (
    "countryCode" TEXT NOT NULL,
    "drapeau_emoji" TEXT NOT NULL,
    "capitale" TEXT NOT NULL,
    "devise" TEXT NOT NULL,
    "langages" TEXT NOT NULL,

    CONSTRAINT "InfosSuppPays_pkey" PRIMARY KEY ("countryCode")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "nbEtoiles" INTEGER NOT NULL,
    "commentaire" TEXT NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" SERIAL NOT NULL,
    "ville" TEXT NOT NULL,
    "continent" "Continent" NOT NULL,
    "lat" DECIMAL(9,6) NOT NULL,
    "long" DECIMAL(9,6) NOT NULL,
    "infoSuppPaysId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etape" (
    "id" SERIAL NOT NULL,
    "dateDeb" DATE NOT NULL,
    "dateFin" DATE NOT NULL,
    "notes" TEXT,
    "hebergement" "TypeHebergement" NOT NULL,
    "voyageId" TEXT NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Etape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voyage" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL DEFAULT 'Mon Voyage',
    "dateDeb" DATE NOT NULL,
    "dateFin" DATE NOT NULL,
    "statut" "StatutVoyage" NOT NULL DEFAULT 'Planifie',
    "utilisateurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voyage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "courriel" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Voyageur',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_courriel_key" ON "Utilisateur"("courriel");

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_infoSuppPaysId_fkey" FOREIGN KEY ("infoSuppPaysId") REFERENCES "InfosSuppPays"("countryCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etape" ADD CONSTRAINT "Etape_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etape" ADD CONSTRAINT "Etape_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voyage" ADD CONSTRAINT "Voyage_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
