-- AlterTable
ALTER TABLE "TaskEvent" ADD COLUMN     "outputs" JSONB NOT NULL DEFAULT '{}';
