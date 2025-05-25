/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `OperatorRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OperatorRole_name_key" ON "OperatorRole"("name");
