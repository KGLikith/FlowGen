/*
  Warnings:

  - The `inputs` column on the `TaskEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `outputs` column on the `TaskEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TaskEvent" DROP COLUMN "inputs",
ADD COLUMN     "inputs" JSONB[],
DROP COLUMN "outputs",
ADD COLUMN     "outputs" JSONB[];
