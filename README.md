# Game Access Membership and Exchange Service (GAMES)

A service for finding and browsing games in different mediums and formats.

## Requirements

- Nodejs
- pnpm
- docker

## Installation

First you need to install Nodejs by downloading it from their website: https://nodejs.org/en/download/ or by using your package manager of choice.

Then you need to install pnpm by running `npm install -g pnpm`

## Starting the development database

After this you need to start the database, you do this by running `docker compose -f docker-compose.dev.yml up -d` in the source-folder of the project.

Now you need to create the database schema, you do this by, from the root of the project, running `cd backend & pnpm prisma db push`

### Note
 If you are running an older version of docker you might need to run `docker-compose -f docker-compose.dev.yml up -d` instead

## Running frontend

From the root of the project, run `cd frontend` to enter the frontend directory.
Then copy the `.env.example` file and rename it to `.env`.
Then simply run `pnpm install` followed by `pnpm run dev`
You can now access the frontend at http://localhost:3000

## Running backend

You need to have two active terminals for this
But first you need to create a `.env` file in the backend directory. Do this by copying the `.env.example` file and renaming it to `.env`.

### Terminal no. 1

From the root of the project, run `cd backend` to enter the backend directory.
Then simply run `pnpm install` followed by `pnpm run compile`

### Terminal no. 2

From the root of the project, run `cd backend` to enter the backend directory.
Then simply run `pnpm run watch`
