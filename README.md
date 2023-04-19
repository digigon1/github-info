# Github info

## Requirements

- PostgreSQL or Docker
- NodeJS (version 17.0.0+)
- Yarn

---
## How to run

### Install dependencies:

`$ yarn`


### Run configured Docker compose

`$ yarn database-up`

In alternative, run Postgres on your machine, run the `initial.sql` file (`$ psql -f migrations/initial.sql`) and configure the .env to point to your Postgres instance


### Run application

`$ yarn start`


---
## Features

### Fetch

Asks for username and gets user from Github and stores it in the database.


### Search 

Asks for languages and location and shows all users that match the requirements.

More than one language can be searched for if user provides a comma-separated list of languages (example: `python, javascript`). If more than one is provided, a user must match all given languages

Location search is case-insensitive and uses like, so it searches for substrings in the user location (example: `Cou` will match Van**cou**ver)

---
## Implementation quirks
Languages are stored in lowercase to help with search
