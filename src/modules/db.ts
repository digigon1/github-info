import pgPromise from "pg-promise"
import { User } from "../types"

const pgp = pgPromise()

// Database singleton
const Database = (() => {
  let instance: pgPromise.IDatabase<object>
  
  return {
    getInstance: (): pgPromise.IDatabase<object> => {
      if (!instance) {
        if (
          !process.env.DB_HOST ||
          !process.env.DB_PORT ||
          !process.env.DB_USER ||
          !process.env.DB_PASSWORD ||
          !process.env.DB_DATABASE
        ) {
          throw new Error("Environment variables not found")
        }

        instance = pgp({
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        })
      }
      
      return instance
    }
  }
})()


// Types
export type SelectFields = 
  Partial<Pick<User, "location" | "languages">>


// Functions
export const insertUser = async (user: User) => {
  const instance = Database.getInstance()

  try {
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

    await instance.none(query, user)
  } catch (e) {
    console.log("Failed while inserting user")

    throw e
  }
}


export const getUserByUsername = 
  async (username: string): Promise<User | undefined> => {
    const instance = Database.getInstance()

    try {
      const query = `
        SELECT 
          *
        FROM
          users
        WHERE
          username = \${username}
      `

      const maybeUser = await instance.oneOrNone(query, { username })

      return !maybeUser ? undefined : {
        username: maybeUser.username,
        name: maybeUser.name,
        location: maybeUser.location,
        languages: maybeUser.languages,
        full_user: maybeUser.full_user
      }
    } catch (e) {
      console.log("Failed while inserting user")

      throw e
    }
  }


export const selectUsers = async (filters?: SelectFields): Promise<User[]> => {
  const instance = Database.getInstance()

  try {
    let query = `
      SELECT 
        *
      FROM
        users
    `

    const conditions = []

    if (filters?.location) {
      conditions.push("location = ${location}")
    }

    if (filters?.languages?.length) {
      conditions.push("languages @> ${languages}")
    }

    if (conditions.length) {
      query += " WHERE "
      query += conditions.join(" AND ")
    }

    const users = await instance.any(query, filters)

    return users.map(u => ({
      username: u.username,
      name: u.name,
      location: u.location,
      languages: u.languages,
      full_user: u.full_user
    }))
  } catch (e) {
    console.log("Failed selecting users")
    throw e
  }
}
