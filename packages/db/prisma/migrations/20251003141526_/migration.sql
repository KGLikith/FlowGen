-- AlterEnum
ALTER TYPE "public"."ActionKey" ADD VALUE 'TRIGGER_WEBHOOK';

-- AlterEnum
ALTER TYPE "public"."TaskGroup" ADD VALUE 'INTEGRATIONS';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."TaskType" ADD VALUE 'WEBHOOK';
ALTER TYPE "public"."TaskType" ADD VALUE 'TRIGGER_WEBHOOK';

-- AlterEnum
ALTER TYPE "public"."TriggerKey" ADD VALUE 'WEBHOOK';
