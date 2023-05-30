/*
 We have a very simple table for this specific issue, however this could be
  made more complex if needed:
 1. Languages could be made into a separate table to avoid data repetition
  1.1. If this was done, we'd need a UserLanguage table with FKs
 2. We could store more general repo information, in which case we'd need a 
  repo table, which could then store languages per repo and other info
  2.1. If we did this, we could then create a view that would build the info
   that this version of the users table has
 3. Indexes should probably be added to both the location and languages columns
*/
CREATE TABLE "users" (
  "username" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "location" TEXT,
  "languages" TEXT[] DEFAULT '{}',
  "full_user" JSONB NOT NULL
)