import { insertUser } from "./modules/db"
import { getUser } from "./modules/github"
import { User } from "./types"

export const fetchUser = async (username: string): Promise<User> => {
  const user = await getUser(username)

  // await insertUser(user)

  return user
}