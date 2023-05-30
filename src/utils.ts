import { User } from "./types"

// ESLint is disabled here purely to help with clean code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const anyToUser = (input: any): User => {
  // This should probably have further checks on the fields
  //  Example: input.username is not null
  return {
    username: input.username,
    name: input.name,
    location: input.location,
    languages: input.languages,
    full_user: input.full_user
  }
}

export const userToString = (user: User) => {
  return `User (username=${user.username}, name=${user.name}, ` +
          `location=${user.location}, languages=${user.languages})`
}