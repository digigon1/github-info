import { getUserByUsername, insertUser } from "../modules/db"
import { getUser } from "../modules/github"
import { User } from "../types"

// Function to retrieve and store user from Github
export const fetchUser = async (username: string): Promise<User> => {
  // Check if user exists in DB
  let user = await getUserByUsername(username)

  if (!user) {
    // If user does not exist
    try {
      // Get user from Github
      user = await getUser(username)
    } catch (e) {
      throw new Error(`Failed getting user ${username}`)
    }
  
    try {
      // Store user in DB
      await insertUser(user)
    } catch (e) {
      throw new Error("Failed inserting new user")
    }  
  }

  // Return user
  return user
}
