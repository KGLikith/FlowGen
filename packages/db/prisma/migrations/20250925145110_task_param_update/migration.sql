/*
  Warnings:

  - You are about to drop the column `taskInfoIdInput` on the `TaskParam` table. All the data in the column will be lost.
  - You are about to drop the column `taskInfoIdOutput` on the `TaskParam` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TaskParam" DROP CONSTRAINT "TaskParam_taskInfoIdInput_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskParam" DROP CONSTRAINT "TaskParam_taskInfoIdOutput_fkey";

-- AlterTable
ALTER TABLE "public"."TaskParam" DROP COLUMN "taskInfoIdInput",
DROP COLUMN "taskInfoIdOutput";

-- CreateTable
CREATE TABLE "public"."_TaskInfoInputs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskInfoInputs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_TaskInfoOutputs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskInfoOutputs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TaskInfoInputs_B_index" ON "public"."_TaskInfoInputs"("B");

-- CreateIndex
CREATE INDEX "_TaskInfoOutputs_B_index" ON "public"."_TaskInfoOutputs"("B");

-- AddForeignKey
ALTER TABLE "public"."_TaskInfoInputs" ADD CONSTRAINT "_TaskInfoInputs_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."TaskInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TaskInfoInputs" ADD CONSTRAINT "_TaskInfoInputs_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."TaskParam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TaskInfoOutputs" ADD CONSTRAINT "_TaskInfoOutputs_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."TaskInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TaskInfoOutputs" ADD CONSTRAINT "_TaskInfoOutputs_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."TaskParam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
