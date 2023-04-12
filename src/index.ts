import * as dotenv from "dotenv"
import { fetchUser } from "./fetch"
import { searchUsers } from "./show"

import * as readline from "readline/promises"
import { User } from "./types"

const userToString = (user: User) => {
  return `User (username=${user.username}, name=${user.name}, ` +
          `location=${user.location}, languages=${user.languages})`
}

const handleFetch = async (rl: readline.Interface) => {
  const line = await rl.question("Username: ")

  const user = await fetchUser(line.trim())

  console.log(userToString(user))
}

const handleSearch = async (rl: readline.Interface) => {
  
  const languagesLine = 
    await rl.question("Languages (example input: C, Python, Typescript): ")
  
  const languages = languagesLine.split(",").map(l => l.trim()).filter(l => l)


  const locationLine = await rl.question("Location: ")

  const location = locationLine.trim()


  const users = await searchUsers({
    languages: languages.length ? languages : undefined,
    location: location.length ? location : undefined,
  })

  console.log(users.map(userToString).join("\n"))
}

const handleQuit = () => {
  console.log("Goodbye")
}

const handleHelp = () => {
  console.log(`
    fetch: Fetches a single user's information from github
    search: Searches the database and displays results
    quit: Exit the program
    help: Show this message
  `)
}

const main = async () => {
  // Load env vars
  dotenv.config()

  // Make interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  // Main loop
  try {
    let command
    do {
      command = (await rl.question("?> ")).toLowerCase().trim()

      switch (command) {
      case "fetch":
        await handleFetch(rl)
        break
      case "search":
        await handleSearch(rl)
        break
      case "quit":
        handleQuit()
        break
      case "help":
      default:
        handleHelp()
      }
  
    } while (command != "quit")
  } finally {
    // Cleanup
    rl.close()
  }
}

main()
