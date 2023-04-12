import { SelectFields, selectUsers } from "./modules/db"
import { User } from "./types"

export const searchUsers = 
  async (parameters: SelectFields): Promise<User[]> => {
    const users = await selectUsers(parameters)

    return users
  }