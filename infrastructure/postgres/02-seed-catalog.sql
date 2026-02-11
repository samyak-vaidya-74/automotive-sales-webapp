-- PostgreSQL uses "Vehicles" (quoted) to match EF Core's default naming
CREATE TABLE "Vehicles" (
    "Id" SERIAL PRIMARY KEY,
    "Make" VARCHAR(100) NOT NULL,
    "Model" VARCHAR(100) NOT NULL,
    "Year" INTEGER NOT NULL,
    "Price" DECIMAL NOT NULL,
    "Mileage" INTEGER NOT NULL,
    "FuelType" VARCHAR(50) NOT NULL,
    "Transmission" VARCHAR(50) NOT NULL,
    "BodyStyle" VARCHAR(50) NOT NULL,
    "Description" TEXT,
    "ImageUrl" TEXT,
    "Vin" VARCHAR(50),
    "SellerEmail" VARCHAR(255) NOT NULL,
    "ListedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "AiAnalysis" TEXT
);

-- Seed a "Frictionless" example for the Bootstrap 5 Home page
INSERT INTO "Vehicles" ("Make", "Model", "Year", "Price", "Mileage", "FuelType", "Transmission", "BodyStyle", "SellerEmail")
VALUES ('Tesla', 'Model 3', 2023, 42000, 8000, 'EV', 'Automatic', 'Sedan', 'admin@example.com');
