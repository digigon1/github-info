import { User } from "../types"
import axios from "axios"

const GITHUB_API = "https://api.github.com"

export const getUser = async (username: string): Promise<User> => {
  try {
    const user = (await axios.get(`${GITHUB_API}/users/${username}`)).data

    const result: User = {
      username: user.login,
      name: user.name,
      location: user.location,
      languages: await getUserLanguages(username),
      full_user: user
    }

    return result
  } catch (error) {

    console.error(error)

    throw error
  }
}

export const getUserLanguages = async (username: string): Promise<string[]> => {
  let repos
  try {
    repos = (await axios.get(`${GITHUB_API}/users/${username}/repos`)).data
  } catch (error) {

    console.error(error)

    throw error
  }

  const languageListList = await Promise.all(
    repos.map(async (repo: { languages_url?: string }) => {
      if (!repo.languages_url) {
        console.error(`Repo is ${JSON.stringify(repo)}`)
        throw new Error()
      }

      const languages = (await axios.get(repo.languages_url)).data

      return Object.keys(languages)
    })
  )

  // Flatten and remove duplicates from list
  const result = [...new Set(languageListList.flat())]

  return result
  
}