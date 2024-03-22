## Description 

A project for processing routes to interact with elements from [star wars world](https://swapi.py4e.com/api/).

Before starting, you will also need to set your MySQL username and password in the .env file to use the local database.

Before using routes that are available only to authorized users, you must
register using the registration route so that the user data is saved in the database.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# development with swc builder
$ npm run start -- -b swc

# watch mode
$ npm run start:dev

# watch mode with swc builder
$ nest start -b swc -w

# production mode
$ npm run start:prod
```

After launch, wait for the following message in the console:
"The data has been successfully downloaded into the database.
You can begin." to begin.

## Test

```bash
# unit tests
$ npm run test

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
