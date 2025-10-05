-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ActionKey" ADD VALUE 'CLICK_ELEMENT';
ALTER TYPE "public"."ActionKey" ADD VALUE 'WAIT_FOR_ELEMENT';

-- AlterEnum
ALTER TYPE "public"."TaskGroup" ADD VALUE 'TIMING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."TaskType" ADD VALUE 'CLICK_ELEMENT';
ALTER TYPE "public"."TaskType" ADD VALUE 'WAIT_FOR_ELEMENT';
