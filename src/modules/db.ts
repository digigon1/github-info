import pgPromise from "pg-promise"
import { User } from "../types"

const pgp = pgPromise()

// Database singleton
const Database = (() => {
  let instance: pgPromise.IDatabase<object>
  
  return {
    getInstance: (): pgPromise.IDatabase<object> => {
      if (!instance) {
        instance = pgp({
          // TODO: DB config
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
    await instance.none(`
      INSERT INTO users (
        name,
        location,
        languages,
        full_user
      )
      VALUES (
        \${name},
        \${location},
        \${languages},
        \${full_user}
      )
    `, user)
  } catch (e) {
    console.log("Failed while inserting user")

    throw e
  }
}

/*
export const selectUsers = async (filters?: SelectFields): Promise<User[]> => {
  const instance = Database.getInstance()

  try {
    await instance.any(`
      SELECT FROM
        users
      WHERE
        
    `)
  } catch (e) {

  }
}
*/