import { User } from "../src/types"
import * as utils from "../src/utils"

describe("Utils", () => {
    describe("anyToUser", () => {
        it("transforms a valid object into a user", () => {
            const input = {
                username: "username",
                name: "name",
                location: "location",
                languages: ["languages"],
                full_user: { test: 1 },
            }

            const user = utils.anyToUser(input)

            expect(user).toEqual(input)
        })

        it("drops useless fields", () => {
            const input = {
                username: "username",
                name: "name",
                location: "location",
                languages: ["languages"],
                full_user: { test: 1 },
                useless: 1,
            }

            const user = utils.anyToUser(input)

            expect(user).toEqual({
                username: input.username,
                name: input.name,
                location: input.location,
                languages: input.languages,
                full_user: input.full_user,
            })
        })
    })

    describe("userToString" , () => {
        it("stringifies a user correctly", () => {
            const user: User = {
                username: "username",
                name: "name",
                location: "location",
                languages: ["languages"],
                full_user: { test: 1 },
            }

            const result = utils.userToString(user)

            expect(result).toBe(
                `User (username=${user.username}, name=${user.name}, ` +
                `location=${user.location}, languages=${user.languages})`
            )
        })
    })
})