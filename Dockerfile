# Base image
FROM node:20.11.1 as base

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate --schema=./src/persistancy/prisma/schema.prisma
RUN npm run build

FROM base as server
CMD [ "node", "dist/main.js" ]

FROM base as migration
CMD [ "npx", "prisma", "migrate", "deploy", "--schema=./src/persistancy/prisma/schema.prisma"]