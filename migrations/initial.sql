CREATE TABLE "users" (
  "username" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "languages" TEXT[] DEFAULT '{}',
  "full_user" JSONB NOT NULL
)