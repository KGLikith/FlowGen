/*
  Warnings:

  - Changed the type of `logLevel` on the `ExecutionLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."logLevel" AS ENUM ('INFO', 'WARN', 'ERROR');

-- AlterTable
ALTER TABLE "public"."ExecutionLog" DROP COLUMN "logLevel",
ADD COLUMN     "logLevel" "public"."logLevel" NOT NULL;
