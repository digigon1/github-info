// Full user JSON is stored in order to query field for extra info if needed
export type User = {
  username: string
  name: string | null
  location: string | null
  languages: string[]
  full_user: object
}