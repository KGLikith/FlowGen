/*
  Warnings:

  - Added the required column `taskInfoId` to the `AvailableAction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `key` on the `AvailableAction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `taskInfoId` to the `AvailableTrigger` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `key` on the `AvailableTrigger` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."TriggerKey" AS ENUM ('LAUNCH_BROWSER');

-- CreateEnum
CREATE TYPE "public"."ActionKey" AS ENUM ('PAGE_TO_HTML', 'EXTRACT_TEXT_FROM_ELEMENT');

-- CreateEnum
CREATE TYPE "public"."TaskParamType" AS ENUM ('STRING', 'BROWSER_INSTANCE');

-- AlterTable
ALTER TABLE "public"."AvailableAction" ADD COLUMN     "taskInfoId" TEXT NOT NULL,
DROP COLUMN "key",
ADD COLUMN     "key" "public"."ActionKey" NOT NULL;

-- AlterTable
ALTER TABLE "public"."AvailableTrigger" ADD COLUMN     "taskInfoId" TEXT NOT NULL,
DROP COLUMN "key",
ADD COLUMN     "key" "public"."TriggerKey" NOT NULL;

-- CreateTable
CREATE TABLE "public"."TaskInfo" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isEntryPoint" BOOLEAN NOT NULL DEFAULT false,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "TaskInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskParam" (
    "id" TEXT NOT NULL,
    "type" "public"."TaskParamType" NOT NULL,
    "name" TEXT NOT NULL,
    "helperText" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "hideHandle" BOOLEAN NOT NULL DEFAULT false,
    "taskInfoIdInput" TEXT NOT NULL,
    "taskInfoIdOutput" TEXT NOT NULL,

    CONSTRAINT "TaskParam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvailableAction_key_key" ON "public"."AvailableAction"("key");

-- CreateIndex
CREATE UNIQUE INDEX "AvailableTrigger_key_key" ON "public"."AvailableTrigger"("key");

-- AddForeignKey
ALTER TABLE "public"."AvailableTrigger" ADD CONSTRAINT "AvailableTrigger_taskInfoId_fkey" FOREIGN KEY ("taskInfoId") REFERENCES "public"."TaskInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AvailableAction" ADD CONSTRAINT "AvailableAction_taskInfoId_fkey" FOREIGN KEY ("taskInfoId") REFERENCES "public"."TaskInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskParam" ADD CONSTRAINT "TaskParam_taskInfoIdInput_fkey" FOREIGN KEY ("taskInfoIdInput") REFERENCES "public"."TaskInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskParam" ADD CONSTRAINT "TaskParam_taskInfoIdOutput_fkey" FOREIGN KEY ("taskInfoIdOutput") REFERENCES "public"."TaskInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
