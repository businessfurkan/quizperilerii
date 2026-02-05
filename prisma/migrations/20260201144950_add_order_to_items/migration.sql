-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TournamentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TournamentItem_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TournamentItem" ("id", "image", "quizId", "text") SELECT "id", "image", "quizId", "text" FROM "TournamentItem";
DROP TABLE "TournamentItem";
ALTER TABLE "new_TournamentItem" RENAME TO "TournamentItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
