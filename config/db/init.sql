DO
$$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname='bootcamp_role'
  ) THEN
    CREATE ROLE bootcamp_role WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp';
  END IF;
END
$$;

CREATE TABLE "rentals" (
  "id" SERIAL PRIMARY KEY,
  "customerId" INTEGER NOT NULL,
  "gameId" INTEGER NOT NULL,
  "rentDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "daysRented" INTEGER NOT NULL,
  "returnDate" DATE,
  "originalPrice" INTEGER NOT NULL,
  "delayFee" INTEGER
);

CREATE TABLE "customers" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "cpf" VARCHAR(11) NOT NULL,
  "birthday" DATE NOT NULL
);

CREATE TABLE "games" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "stockTotal" INTEGER NOT NULL,
  "categoryId" INTEGER NOT NULL,
  "pricePerDay" INTEGER NOT NULL
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL
);