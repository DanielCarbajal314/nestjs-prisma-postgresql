## Description

This is a nestjs example application that uses postgresql with Prisma ORM to persist data with a basic Authentication setup. Everything is containerized:

- **api service** : Defined in the Dockerfile, with target **server**. This runs the nestjs rest api application. It waits for the migration container to exits before it starts. Runs on http://localhost:3000

- **database** : Postgresql Database, runs on default port 5432

- **database managing tool**: PgAdmin, a web based database GUI Admin tool. It already has the database connection registered. Runs on http://localhost:8080

- **prisma migration** : Defined in the Dockerfile, with target **migration**. This runs prisma CLI command to run all the migrations, when this container exits, api service container will start. It waits for Database container healthcheck to pass in order to be executed. 

## Remarks
- Unit Test:
    Example on how to unit test controller by injecting mocked dependencies [here](https://github.com/DanielCarbajal314/nestjs-prisma-postgresql/blob/54d19974d3bb57237b000d7b81458549c8d6b2a3/src/controllers/user.controller.spec.ts#L21)

- Inline Documentation:
    Example on how to document interfaces to help as inline documentation for other developers: [here](https://github.com/DanielCarbajal314/nestjs-prisma-postgresql/blob/54d19974d3bb57237b000d7b81458549c8d6b2a3/src/persistancy/repositories/interfaces/IUserRepository.ts#L13)

## Running the app

Theres a make file to start all the services of this application
```bash
$ make up
```
This will build and start all the container defined in the docker-compose.yml
**note : It requires support for docker compose file version: '3.9', I used docker-compose client v2.24.3**

## Test

On ./postman directory I left a postman collection and enviromental file to do a full integration test of all endpoints. Also adding swagger with bearer authentication in http://localhost:3000/api# , the default creadentials created by the seeding script are: 

```javascript
{
  "password": "test1234",
  "username": "daniel"
}
```

## Endpoints
- **[POST] /auth/login** : Logging action, returns the bearer JWT to be used in the authorized request
   Request
    ```javascript
    {
      "password": "test1234",
      "username": "daniel"
    }
    ```
    Response
    ```json
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRhbmllbCIsImlkIjoxLCJlbWFpbCI6ImRhbmllbC5jYXJiYWphbEBwdWNwLmVkdS5wZSIsInJvbGVzIjpbIkFkbWluIiwiQXBwbGljYW50Il0sImlhdCI6MTcxMDEzNjU3NSwiZXhwIjoxNzEwMTQwMTc1fQ.XzprBAUyxqQKtL_lcmBbXLXS-0jDLtzWZoZ9lxpFf-k"
    }
    ```
- **[POST]  /auth/register**  :  Registers user, requires to be logged in with an account with Admin role
    Request
    ```javascript
    {
        "username": "applicant",
        "password": "test1234",
        "roles": ["Applicant"],
        "email": "applicant@asd.com"
    }
    ```
- **[GET]  /auth/register**  :  Registers user, requires to be logged in with an account with Admin role
    Request
    ```javascript
    {
        "username": "applicant",
        "password": "test1234",
        "roles": ["Applicant"],
        "email": "applicant@asd.com"
    }
    ```
- **[GET]  /applications** :  List all loan applications, requires to be logged in with an account with Admin role
    Response
    ```javascript
    [
        {
            "userEmail": "daniel.carbajal@pucp.edu.pe",
            "username": "daniel",
            "amount": 3000,
            "status": "SUMMITED",
            "description": "Store investment money required to buy products",
            "createdAt": "2024-03-11T06:13:51.459Z",
            "id": 1
        }
    ]
    ```
- **[GET]  /applications/:id** :  Get a loan application by id, requires to be logged in with an account with Admin role or to be the Applicant user that registered the loan application
    Response
    ```javascript
    {
        "userEmail": "daniel.carbajal@pucp.edu.pe",
        "username": "daniel",
        "amount": 3000,
        "status": "SUMMITED",
        "description": "Store investment money required to buy products",
        "createdAt": "2024-03-11T06:13:51.459Z",
        "id": 1
    }
    ```    
- **[POST]  /applications** :  Register a new loan application
    Request
    ```javascript
    {
        "amount": 3000,
        "description": "Store investment money required to buy products"
    }
    ```
    Response
    ```javascript
    {
        "userEmail": "daniel.carbajal@pucp.edu.pe",
        "username": "daniel",
        "amount": 3000,
        "status": "SUMMITED",
        "description": "Store investment money required to buy products",
        "createdAt": "2024-03-11T06:13:51.459Z",
        "id": 1
    }
    ```    

## License

Nest is [MIT licensed](LICENSE).
