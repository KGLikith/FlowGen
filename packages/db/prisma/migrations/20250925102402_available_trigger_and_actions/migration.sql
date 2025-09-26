/*
  Warnings:

  - You are about to drop the column `category` on the `AvailableAction` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `AvailableTrigger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AvailableAction" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "public"."AvailableTrigger" DROP COLUMN "category";
