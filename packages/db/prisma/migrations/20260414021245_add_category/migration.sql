/*
  Warnings:

  - Added the required column `category` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "urlId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Post" ("active", "content", "date", "description", "id", "imageUrl", "tags", "title", "urlId") SELECT "active", "content", "date", "description", "id", "imageUrl", "tags", "title", "urlId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_urlId_key" ON "Post"("urlId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
