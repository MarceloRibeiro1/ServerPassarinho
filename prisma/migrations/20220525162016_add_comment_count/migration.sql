-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "authorProfile" TEXT NOT NULL,
    "responseTo" INTEGER,
    CONSTRAINT "Post_responseTo_fkey" FOREIGN KEY ("responseTo") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_authorProfile_fkey" FOREIGN KEY ("authorProfile") REFERENCES "UserProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorProfile", "content", "createdAt", "id", "image", "likes", "responseTo") SELECT "authorProfile", "content", "createdAt", "id", "image", "likes", "responseTo" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
