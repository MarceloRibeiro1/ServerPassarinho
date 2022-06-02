/*
  Warnings:

  - Made the column `password` on table `useraccount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `useraccount` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_useraccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_useraccount" ("email", "id", "password", "username") SELECT "email", "id", "password", "username" FROM "useraccount";
DROP TABLE "useraccount";
ALTER TABLE "new_useraccount" RENAME TO "useraccount";
CREATE UNIQUE INDEX "useraccount_email_key" ON "useraccount"("email");
CREATE UNIQUE INDEX "useraccount_username_key" ON "useraccount"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
