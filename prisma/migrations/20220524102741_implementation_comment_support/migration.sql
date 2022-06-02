/*
  Warnings:

  - You are about to drop the `_userLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_userLikes_B_index";

-- DropIndex
DROP INDEX "_userLikes_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_userLikes";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_userLikedPosts" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "UserProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "authorProfile" TEXT NOT NULL,
    "response" INTEGER,
    CONSTRAINT "Post_response_fkey" FOREIGN KEY ("response") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_authorProfile_fkey" FOREIGN KEY ("authorProfile") REFERENCES "UserProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorProfile", "content", "createdAt", "id", "image", "likes") SELECT "authorProfile", "content", "createdAt", "id", "image", "likes" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_userLikedPosts_AB_unique" ON "_userLikedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_userLikedPosts_B_index" ON "_userLikedPosts"("B");
