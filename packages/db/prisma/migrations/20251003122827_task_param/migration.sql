-- AlterEnum
ALTER TYPE "public"."TaskParamType" ADD VALUE 'SELECT';

-- AlterTable
ALTER TABLE "public"."TaskParam" ADD COLUMN     "options" TEXT[];
