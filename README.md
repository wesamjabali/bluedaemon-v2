# DePaul's Course Automation Solution

### Now with slash commands!

To run this project:

create `.env` in root folder:
```
NODE_ENV=dev/prod
DATABASE_URL=postgresql://username:password@localhost:5432/dbName

CLIENT_TOKEN=
CLIENT_ID=
DEV_GUILD_ID=
```

Then:
```npm i
npm install prisma -g
prisma migrate dev

npm run dev
OR
npm run start```

### Using Docker:
Includes Node and Postgres.

.env:
```
NODE_ENV=dev/prod
DATABASE_URL=postgresql://username:password@localhost:5432/dbName

CLIENT_TOKEN=
CLIENT_ID=
DEV_GUILD_ID=

POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=dbName
```

```
docker-compose up
```