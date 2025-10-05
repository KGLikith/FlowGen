-- CreateEnum
CREATE TYPE "public"."TaskGroup" AS ENUM ('DATA_EXTRACTION', 'USER_INTERACTIONS');

-- AlterTable
ALTER TABLE "public"."TaskInfo" ADD COLUMN     "group" "public"."TaskGroup" NOT NULL DEFAULT 'DATA_EXTRACTION',
ALTER COLUMN "type" DROP DEFAULT;
