import * as dotenv from "dotenv"
import { fetchUser } from "./fetch"

const main = async () => {
  dotenv.config()

  console.log(await fetchUser("digigon1"))
}

main()
