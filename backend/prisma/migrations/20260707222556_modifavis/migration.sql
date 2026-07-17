-- DropForeignKey
ALTER TABLE "Avis" DROP CONSTRAINT "Avis_destinationId_fkey";

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
