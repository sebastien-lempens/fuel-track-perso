-- CreateTable
CREATE TABLE "RawFuelEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "liters" REAL NOT NULL,
    "priceTotalLiter" REAL NOT NULL,
    "odometer" INTEGER NOT NULL
);
