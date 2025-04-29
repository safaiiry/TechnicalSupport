/*
  Warnings:

  - Added the required column `field_order` to the `TicketField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketField" ADD COLUMN     "field_order" INTEGER NOT NULL;
