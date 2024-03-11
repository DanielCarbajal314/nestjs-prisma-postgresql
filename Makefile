up:
	docker compose build
	docker compose up

up-development:
	docker compose down -v
	docker compose build
	docker compose up db pgadmin migration -d
	npm i
	npm run start:dev

create-migration:
	npx prisma migrate dev --name ${name} --schema ./src/persistancy/prisma/schema.prisma

generate-client:
	npx prisma generate --schema=./src/persistancy/prisma/schema.prisma