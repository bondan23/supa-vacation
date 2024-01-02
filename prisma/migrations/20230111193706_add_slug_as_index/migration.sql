/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Home` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "slug" VARCHAR(200) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Home_slug_key" ON "Home"("slug");

-- CreateIndex
CREATE INDEX "Home_slug_idx" ON "Home"("slug");
