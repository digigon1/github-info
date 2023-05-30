import * as dotenv from "dotenv"
import { fetchUser } from "./functions/fetch"
import * as readline from "readline/promises"
import { searchUsers } from "./functions/show"
import { userToString } from "./utils"

const handleFetch = async (rl: readline.Interface) => {
  // Prompt for username
  const line = await rl.question("Username: ")

  // Parse username
  const username = line.trim()
  
  // Fetch and store user
  try {
    const user = await fetchUser(username)
  
    // Display result
    console.log()
    console.log("===== USER =====")
    console.log(userToString(user))
    console.log()
  } catch (e) {
    console.error(e)
  }
}

const handleSearch = async (rl: readline.Interface) => {
  // Prompt for language list
  const languagesLine = 
    await rl.question("Languages (example input: C, Python, Typescript): ")
  
  // Split list, trim and lowercase it to make it searchable
  const languages = 
    languagesLine
      .split(",")
      .map(l => 
        l.trim().toLowerCase()
      )
      .filter(l => l)

  
  // Prompt for location
  const locationLine = await rl.question("Location: ")

  // Trim location
  const location = locationLine.trim()


  // Search, but only send args if they are defined
  const users = await searchUsers({
    languages: languages.length !== 0 ? languages : undefined,
    location: location.length !== 0 ? location : undefined,
  })

  // Display results
  console.log()
  console.log("===== RESULTS =====")
  console.log(users.map(userToString).join("\n"))
  console.log()
}

const handleQuit = () => {
  console.log("Goodbye")
}

const handleHelp = () => {
  // Show simple help
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
    // This loop could be made into a recursive call to follow the functional
    //  paradigm
    do {
      // Get command
      command = (await rl.question("?> ")).toLowerCase().trim()

      switch (command) {
      // Get user from Github
      case "fetch":
        await handleFetch(rl)
        break
      // Search users in DB
      case "search":
        await handleSearch(rl)
        break
      // Quit application
      case "quit":
        handleQuit()
        break
      // Show help
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

// Run application
main()
