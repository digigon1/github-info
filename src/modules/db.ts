import pgPromise from "pg-promise"
import { User } from "../types"
import { anyToUser } from "../utils"

const pgp = pgPromise()

// Database singleton
const Database = (() => {
  let client: pgPromise.IDatabase<object>
  
  return {
    getInstance: (): pgPromise.IDatabase<object> => {
      // Init client if none exists
      if (!client) {
        // Fail if any env var is missing
        if (
          !process.env.DB_HOST ||
          !process.env.DB_PORT ||
          !process.env.DB_USER ||
          !process.env.DB_PASSWORD ||
          !process.env.DB_DATABASE
        ) {
          throw new Error("Environment variables not found")
        }

        // Init client with env vars
        client = pgp({
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        })
      }
      
      // Return existing client
      return client
    }
  }
})()


// Types
// We only filter by location and languages, so let's only pick these
export type SelectFields = 
  Partial<Pick<User, "location" | "languages">>


// Functions
export const insertUser = async (user: User) => {
  const instance = Database.getInstance()

  // Insert query
  // This could be moved into an insert function in DB which parses the user
  //  object, but for such a simple solution, this would be overkill
  const query = `
    INSERT INTO users (
      username,
      name,
      location,
      languages,
      full_user
    )
    VALUES (
      \${username},
      \${name},
      \${location},
      \${languages},
      \${full_user}
    )
  `

  // Insert and return nothing
  await instance.none(query, user)
}

// Function to check if user already exists, 
//  avoids fetching same user more than once
export const getUserByUsername = 
  async (username: string): Promise<User | undefined> => {
    const instance = Database.getInstance()


    const query = `
      SELECT 
        *
      FROM
        users
      WHERE
        username = \${username}
    `

    // Get either an existing user or no user
    const maybeUser = await instance.oneOrNone(query, { username })

    // Return undefined if user does not exist
    return !maybeUser ? undefined : anyToUser(maybeUser)
  }


export const selectUsers = async (filters?: SelectFields): Promise<User[]> => {
  const instance = Database.getInstance()

  // Query builder
  let query = `
    SELECT 
      *
    FROM
      users
  `

  // Conditions for where
  const conditions = []

  // If we get a location, add it
  if (filters?.location) {
    conditions.push("location ILIKE '%${location:value}%'")
  }

  // If we get a language list, add it
  if (filters?.languages?.length) {
    conditions.push("languages @> ${languages}")
  }

  // Add where if we have conditions
  if (conditions.length) {
    query += " WHERE "
    query += conditions.join(" AND ")
  }

  // We can have any number of results
  const users = await instance.any(query, filters)

  // Map result for type checking
  return users.map(anyToUser)
}
