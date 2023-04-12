import { getUserByUsername, insertUser } from "./modules/db"
import { getUser } from "./modules/github"
import { User } from "./types"

export const fetchUser = async (username: string): Promise<User> => {
  let user = await getUserByUsername(username)

  if (!user) {
    user = await getUser(username)
  
    try {
      await insertUser(user)
    } catch (e) {
      console.log("Failed inserting new user")
      throw e
    }  
  }


  return user
}