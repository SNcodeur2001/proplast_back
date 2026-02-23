/*
  Warnings:

  - You are about to drop the column `prenom` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "prenom",
ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "contacteVia" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "personneContact" TEXT,
ALTER COLUMN "site" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;
