-- CreateTable
CREATE TABLE "Era" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "masterpieces" JSONB NOT NULL,
    "position_x" REAL NOT NULL,
    "position_y" REAL NOT NULL,
    "width" REAL,
    "height" REAL,
    "eraId" INTEGER NOT NULL,
    "parentNodeId" TEXT,
    CONSTRAINT "Node_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "Era" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Node_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "Node" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "eraId" INTEGER NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    CONSTRAINT "Edge_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "Era" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Edge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Edge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Era_name_key" ON "Era"("name");
