DROP TABLE IF EXISTS "Vehicles"; -- Add this to be safe

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
    "ImageUrls" TEXT[], -- Postgres array type
    "Vin" VARCHAR(50),
    "SellerEmail" VARCHAR(255) NOT NULL,
    "ListedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "AiAnalysis" TEXT
);

INSERT INTO "Vehicles" ("Make", "Model", "Year", "Price", "Mileage", "FuelType", "Transmission", "BodyStyle", "SellerEmail", "ImageUrls", "Description", "Vin")
VALUES ('Tesla', 'Model 3', 2023, 42000, 8000, 'EV', 'Automatic', 'Sedan', 'admin@example.com', ARRAY['https://images.unsplash.com'], 'No description provided', 'N/A');

