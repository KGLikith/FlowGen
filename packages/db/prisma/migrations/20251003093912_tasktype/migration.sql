/*
  Warnings:

  - The `type` column on the `TaskInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "public"."ActionKey" ADD VALUE 'FILL_INPUT';

-- AlterEnum
ALTER TYPE "public"."TaskType" ADD VALUE 'FILL_INPUT';

-- AlterTable
ALTER TABLE "public"."TaskInfo" DROP COLUMN "type",
ADD COLUMN     "type" "public"."TaskType" NOT NULL DEFAULT 'LAUNCH_BROWSER';
