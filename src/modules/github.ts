import { User } from "../types"
import axios from "axios"

const GITHUB_API = "https://api.github.com"

export const getUser = async (username: string): Promise<User> => {
  // Get user data from github
  const user = (await axios.get(`${GITHUB_API}/users/${username}`)).data
  
  // Transform it into result type
  const result: User = {
    username: user.login,
    name: user.name,
    location: user.location,
    languages: await getUserLanguages(username),
    full_user: user
  }

  // Return result
  return result
}

export const getUserLanguages = async (username: string): Promise<string[]> => {
  // Get all user repos
  const repos = (await axios.get(`${GITHUB_API}/users/${username}/repos`)).data

  // Get list of languages per repo
  const languageListList = await Promise.all(
    repos.map(async (repo: { languages_url?: string }) => {
      // Fail early if repo info is somehow wrong
      if (!repo.languages_url) {
        throw new Error(`Malformed repo: ${JSON.stringify(repo)}`)
      }

      // Get languages for repo
      const languages = (await axios.get(repo.languages_url)).data

      // Result is in format { [language: string]: number }, 
      //  transform into string[] and store all langs as lowercase to handle
      //  search
      return Object.keys(languages).map(lang => lang.toLowerCase())
    })
  )

  // Flatten and remove duplicates from list
  const result = [...new Set(languageListList.flat())]

  // Return result
  return result
}