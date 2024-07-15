

<p align="center">
  <img src="./img/logo.png" width="256">
</p>

---

<p align="center">
<img src="https://forthebadge.com/images/badges/built-with-love.svg">
<img src="https://forthebadge.com/images/badges/made-with-typescript.svg">
<img src="https://forthebadge.com/images/badges/works-on-my-machine.svg">
<br>
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white">
<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=blue">
</p>

<div align="center">
<h1>Backend system for chess game</h1>
This project implements a robust backend system for chess in <b>TypeScript</b> using <b>Node.js</b>, <b>Express.js</b>, <b>Sequelize</b>, and other modern tools. Developed as part of the Master's Degree in Computer Engineering and Automation (<b>LM-32</b>) at <b>UNIVPM</b> for the 2023-2024 academic year, it showcases the application of professional backend development practices and design patterns.<br>
The system was developed by students <a href="https://github.com/nicolobartolinii">Nicolò Bartolini</a> and <a href="https://github.com/NicolaPicciafuoco">Nicola Picciafuoco</a> for the <b>Advanced Programming</b> course led by Prof. Adriano Mancini.<br>
Detailed project objectives, unique features, and in-depth technical aspects are discussed in the following sections of this README.
</div>

---

# Table of contents

- [Project goals](#project-goals)
- [Tools used](#tools-used)
- [Patterns used](#patterns-used)
  - [Model-Controller (MVC)](#mvc-model-controller)
  - [Data Access Object (DAO)](#data-access-object-dao)
  - [Repository](#repository)
  - [Singleton](#singleton)
  - [Chain of Responsibility](#chain-of-responsibility)
  - [Factory Method](#factory-method)
  - [Strategy](#strategy)
- [Endpoints](#endpoints)
  - [POST `/login`](#post-login)
- [UML diagrams](#umldiagrams)
  - [uses case](#usecase)
  - [sequenzadiagrams](#sequenzadiagrams)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

# Project goals

This project aims to develop a robust and secure backend system for a chess game application, demonstrating advanced programming concepts and best practices in backend development. The primary objectives are:

1. Implement a **chess game backend system** allowing users to play against AI or other players, integrating the [`js-chess-engine`](https://npmjs.com/package/js-chess-engine) library for game logic.
2. Develop a secure **JWT-based asymmetric authentication** system with role-based access control, including admin functionality.
3. Create a **token-based economy** for game participation, with specific costs for game creation and moves.
4. Design and implement **RESTful API endpoints** for game management, move making, game state tracking, and other functionalities.
5. Implement **data export functionality** in JSON and PDF formats, including victory certificates.
6. Create an unauthenticated **public leaderboard system** with customizable sorting options.
7. Integrate a database using [**Sequelize ORM**](https://sequelize.org/) to store game and user data efficiently.
8. Implement **middleware** for request _validation_, _error handling_, and other cross-cutting concerns.
9. Ensure code quality through **TypeScript** usage, comprehensive _commenting_, and application of various _design patterns_.
10. Configure the project for **easy deployment** using [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).
11. Develop a comprehensive **test suite** using [Postman](https://www.postman.com/) and [Newman](https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/) to ensure API reliability.
12. Adhere to RESTful API design principles and backend development best practices throughout the project.

This chess game backend system serves as a practical application of advanced programming techniques, showcasing the ability to create a scalable, maintainable, and feature-rich application in a real-world context.

# Tools used

This project leverages a variety of modern tools and technologies for backend development:

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [js-chess-engine](https://www.npmjs.com/package/js-chess-engine) - JavaScript chess engine for game logic
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [Postman](https://www.postman.com/) and [Newman](https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/)
- [PDFKit](https://pdfkit.org/) - PDF generation library for Node.js
- [Mermaid](https://mermaid-js.github.io/mermaid/#/) - Diagramming and charting tool
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) and [sequelize-bcrypt](https://www.npmjs.com/package/sequelize-bcrypt) - Password hashing libraries
- [Sharp](https://sharp.pixelplumbing.com/) - High performance Node.js image processing

Certamente, ecco una versione leggermente più dettagliata della sezione "Patterns Used":


# Patterns used

This project implements several design patterns and two architectural patterns to ensure a robust, maintainable, and scalable codebase. Each pattern addresses specific challenges in software design and contributes to the overall quality of the application.

## MVC (Model-Controller)

The **Model-Controller** (**MC**) architectural pattern is used to separate concerns in the application:

- **Models**: represent the data structures and database schema, encapsulating the business logic and data manipulation.
- **Controllers**: handle incoming HTTP requests, process data using the models, and return appropriate responses.

As this is a backend-only project, the traditional **View** layer is omitted, resulting in an MC rather than MVC structure.

## Data Access Object (DAO)

The **DAO** pattern provides an abstract interface to a database, encapsulating all access logic and exposing methods for database operations.

#### Implementation
Leveraged through Sequelize ORM to [define database models](https://github.com/nicolobartolinii/chess-backend/blob/main/src/models) and interact with the database. This abstraction simplifies database integration and allows for easier switching between different database systems if needed.


## Repository

The **Repository** pattern mediates between the domain and data mapping layers, acting like an in-memory collection of domain objects. This pattern centralizes data access logic, improving maintainability and allowing for easier implementation of caching or data retrieval strategies.

#### Implementation
Defines [methods for database queries and interactions](https://github.com/nicolobartolinii/chess-backend/blob/main/src/repositories), working with Sequelize models (DAO) to provide a clean functionality for data access.

## Singleton

The [Singleton](https://refactoring.guru/design-patterns/singleton) creational pattern ensures a class has only one instance and provides a global point of access to it. 

<p align="center">
    <img src="https://refactoring.guru/images/patterns/diagrams/singleton/structure-en.png" width="50%">
</p>

*Image source: [Refactoring Guru](https://refactoring.guru/design-patterns/singleton), with [permission](https://refactoring.guru/content-usage-policy)

#### Implementation
Used for managing [database connections](https://github.com/nicolobartolinii/chess-backend/blob/main/src/db/sequelizeConnection.ts), ensuring that only one connection pool is maintained throughout the application lifecycle. This optimizes resource usage and provides a consistent interface for database operations.

## Chain of Responsibility

The [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility) behavioral pattern passes requests along a chain of handlers, allowing multiple objects to handle the request without coupling sender to receiver.

<p align="center">
    <img src="https://refactoring.guru/images/patterns/diagrams/chain-of-responsibility/solution1-en.png" width="75%">
</p>

*Image source: [Refactoring Guru](https://refactoring.guru/design-patterns/chain-of-responsibility), with [permission](https://refactoring.guru/content-usage-policy)

#### Implementation
Utilized through [Express.js middleware system](https://expressjs.com/en/guide/using-middleware.html), where each middleware function can process the request, perform specific tasks (e.g., authentication, logging, error handling), and decide whether to pass it to the next handler in the chain. This creates a flexible and extensible request processing pipeline.

In our project, the Chain of Responsibility pattern is applied to handle [request validation, authentication, and error handling](https://github.com/nicolobartolinii/chess-backend/blob/main/src/middlewares) in a modular and composable manner.

## Factory Method

The [Factory Method](https://refactoring.guru/design-patterns/factory-method) creational pattern provides an interface for creating objects in a superclass, allowing subclasses to alter the type of objects created.

<p align="center">
    <img src="https://refactoring.guru/images/patterns/diagrams/factory-method/structure.png" width="60%">
</p>

*Image source: [Refactoring Guru](https://refactoring.guru/design-patterns/factory-method), with [permission](https://refactoring.guru/content-usage-policy)

#### Implementation
- [`ResponseFactory`](https://github.com/nicolobartolinii/chess-backend/blob/main/src/factories/responseFactory.ts): creates standardized JSON responses, ensuring consistency across the API.
- [`ErrorFactory`](https://github.com/nicolobartolinii/chess-backend/blob/main/src/factories/errorFactory.ts): generates consistent error structures, facilitating uniform error handling and reporting.

This approach centralizes object creation logic and makes it easier to modify or extend response and error handling in the future.

## Strategy

The [Strategy](https://refactoring.guru/design-patterns/strategy) behavioral pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.

<p align="center">
    <img src="https://refactoring.guru/images/patterns/diagrams/strategy/structure.png" width="50%">
</p>

*Image source: [Refactoring Guru](https://refactoring.guru/design-patterns/strategy), with [permission](https://refactoring.guru/content-usage-policy)

#### Implementation
Used for [exporting game move history in different formats](https://github.com/nicolobartolinii/chess-backend/blob/main/src/strategies):
- `JSONExportStrategy`: Handles exporting in JSON format.
- `PDFExportStrategy`: Manages exporting in PDF format.

This pattern allows for easy extension to support additional export formats in the future without modifying existing code, adhering to the Open/Closed principle.

# Endpoints

| HTTP Verb | Endpoint                          | Description                                      | JWT Authentication |
|-----------|-----------------------------------|--------------------------------------------------|:------------------:|
| POST      | `/login`                          | Authenticate user                                |         ❌          |
| POST      | `/admin/update-tokens`            | Recharge user's credits (admin only)             |         ✅          |
| GET       | `/players/ranking `               | Retrieve player rankings by score                |         ❌          |
| POST      | `/games`                          | Create a new chess match                         |         ✅          |
| GET       | `/games`                          | Retrieve user's completed match history          |         ✅          |
| GET       | `/games/{gameId}/status`          | Retrieve current status of a specific chess game |         ✅          |
| GET       | `/games/{gameId}/win-certificate` | Generate victory certificate for a match         |         ✅          |
| POST      | `/games/{gameId}/moves`           | Make a move in the game                          |         ✅          |
| GET       | `/games/{gameId}/board`           | Retrieve the latest game board configuration     |         ✅          |
| GET       | `/games/{gameId}/details`         | Retrieve game details (PDF or JSON format)       |         ✅          |
| POST      | `/games/{gameId}/abandon`         | Forfeit a match                                  |         ✅          |

## POST `/login`

The login route is used to authenticate a user. The user must provide an email and a password in the request body. The email is used to find the player in the database and the password is used to authenticate the player. If the player is successfully authenticated, a JWT token is generated and returned to the player.

### Request body example


```json

{

  "email": "email@example.com",

  "password": "password"

}

```

### Response example


```json

{

  "

    token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiZm9vIiwiaWF0IjoxNjI5MzUwNzQ4LCJleHAiOjE2MjkzNTA3NDh9.7"

}

```

## GET `/players/ranking?field=points&order=desc/asc`

This endpoint retrieves the rankings of all players, sorted according to a specified field and order. Clients must provide both the sorting field and the direction of the sort.
### Query Parameters

- **field**: The field by which the ranking is to be ordered. This must be specified by the client, and must be points.
- **order**: The direction of the sort. This must be specified by the client, and must be either ASC or DESC.


### Response example


```json

{
  "success": true,
  "statusCode": 200,
  "message": "Players retrieved successfully",
  "data": [
    {
      "player_id": 1,
      "username": "prova",
      "email": "prova@prova.it",
      "points": "0.0000",
      "tokens": "10.0000"
    },
    {
      "player_id": 2,
      "username": "franco",
      "email": "franco@giovanni.it",
      "points": "1.0000",
      "tokens": "8.1000"
    }
  ]
}


```
## POST `/games/create`

This endpoint allows users to create a new chess game. The user must provide the email of the opponent or the difficulty level of the AI opponent in the request body. The user must also provide a JWT token in the Authorization header to authenticate the request.
### Request body example(another player)

```json

{

  "email": "email@example.com",

}

```

### Request body example(Vs IA)

```json

{
  "AI_difficulty": "MONKEY"
}

```

### Response example
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Game created successfully",
  "data": {
    "game_id": 3,
    "player_1_id": 1,
    "player_2_id": null,
    "AI_difficulty": "MONKEY",
    "game_status": "ACTIVE",
    "start_date": "2024-07-15T07:55:51.091Z"
  }
}
```


## GET `/games/history?start_date=<AAAA-MM-DD>&order=desc/asc`

The login route is used to authenticate a user. The user must provide an email and a password in the request body. The email is used to find the player in the database and the password is used to authenticate the player. If the player is successfully authenticated, a JWT token is generated and returned to the player.

### Query Parameters
-**start_date**: The date from which to retrieve the game history. This must be specified by the client in the format YYYY-MM-DD.
-**order**: The direction of the sort. This must be specified by the client, and must be either ASC or DESC.

### Response example

```json

{
  "success": true,
  "statusCode": 200,
  "message": "Games history retrieved successfully",
  "data": [
    {
      "game_id": 2,
      "game_status": "FINISHED",
      "number_of_moves": 11,
      "start_date": "2024-07-10T08:26:51.998Z",
      "winner_id": 2,
      "result": "You are the winner."
    }
  ]
}

```
## GET `/games/:gameId/status`

This endpoint retrieves the current status of a specific chess game. The client must provide the game ID in the URL to identify the game, the player musto to be authenticated with a JWT token.
### Query Parameters
-**gameId**: The ID of the game for which to retrieve the status. This must be specified by the client in the URL.

### Response example

```json

{
  "success": true,
  "statusCode": 200,
  "message": "Game status retrieved successfully",
  "data": {
    "game_id": 2,
    "status": "FINISHED",
    "current_configuration": {
      "moves": {},
      "pieces": {
        "E1": "K",
        "A1": "R",
        "H1": "R",
        "C1": "B",
        "B1": "N",
        "A2": "P",
        "B2": "P",
        "C2": "P",
        "D2": "P",
        "F2": "P",
        "G2": "P",
        "H2": "P",
        "A8": "r",
        "H8": "r",
        "C8": "b",
        "B8": "n",
        "G8": "n",
        "A7": "p",
        "B7": "p",
        "C7": "p",
        "D7": "p",
        "G7": "p",
        "H7": "p",
        "E4": "P",
        "E5": "p",
        "C4": "B",
        "H4": "q",
        "D8": "k",
        "F3": "N",
        "B6": "b",
        "F8": "Q"
      },
      "turn": "black",
      "isFinished": true,
      "check": true,
      "checkMate": true,
      "castling": {
        "whiteShort": true,
        "blackShort": false,
        "whiteLong": true,
        "blackLong": false
      },
      "enPassant": null,
      "halfMove": 4,
      "fullMove": 6
    },
    "opponent": 1,
    "winner_id": 2,
    "result": "You are the winner."
  }
}

```
## GET `/games/:gameId/win-certificate`

This endpoint retrieves a certificate in the pdf format of victory for a specific chess game. The client must provide the game ID in the URL to identify the game, the player must be the winner of the game, and must be authenticated with a JWT token.
### ### Query Parameters
-**gameId**: The ID of the game for which to retrieve the pdf certificate. This must be specified by the client in the URL.

### Response example

![img.png](img/win_certificate.png)
## POST `/login`

The login route is used to authenticate a user. The user must provide an email and a password in the request body. The email is used to find the player in the database and the password is used to authenticate the player. If the player is successfully authenticated, a JWT token is generated and returned to the player.

### Request body example


```json

{

  "email": "email@example.com",

  "password": "password"

}

```
## POST `/login`

The login route is used to authenticate a user. The user must provide an email and a password in the request body. The email is used to find the player in the database and the password is used to authenticate the player. If the player is successfully authenticated, a JWT token is generated and returned to the player.

### Request body example


```json

{

  "email": "email@example.com",

  "password": "password"

}

```


### Response example


```json

{

  "

    token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiZm9vIiwiaWF0IjoxNjI5MzUwNzQ4LCJleHAiOjE2MjkzNTA3NDh9.7"

}

```


# Use Case Diagram
<img src="./img/usecase.png">

### Sequence diagram

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant Repository
    participant DAO
    participant ErrorFactory
    participant ResponseFactory

    Client->>+App: POST /login (email, password)
    App->>+Middleware: emailValidationMiddleware()
    alt Valid email
        Middleware-->>-App: next()
        App->>+Middleware: passwordValidationMiddleware()
        alt Valid password
            Middleware-->>-App: next()
            App->>+Controller: login()
            Controller->>+Service: loginPlayer(email, password)
            Service->>+Repository: findByEmail(email)
            Repository->>+DAO: findOne()
            DAO-->>-Repository: Player
            Repository-->>-Service: Player
            Service->>+DAO: authenticate(password)
            DAO-->>-Service: Authentication result
            alt Authentication successful
                Service->>+Service: generateToken(payload)
                Service-->>-Controller: JWT Token
                deactivate Service
                Controller->>+ResponseFactory: success(token)
                ResponseFactory-->>-Controller: JSON Response
                Controller-->>-App: HTTP Response
                App-->>Client: HTTP Response with token
            else Authentication failed
                activate Service
                Service->>+ErrorFactory: throw unauthorized()
                ErrorFactory-->>-Service: error
                Service-->>+Controller: error
                deactivate Service
                Controller->>-Middleware: next(error)
                activate Middleware
                Middleware->>+ResponseFactory: error(error)
                ResponseFactory-->>-Middleware: JSON Error Response
                Middleware-->>-App: HTTP Error Response
                App-->>Client: HTTP Error Response
            end
        else Not valid password
            activate Middleware
            Middleware->>+ErrorFactory: badRequest()
            ErrorFactory->>-Middleware: error
            Middleware->>+Middleware: next(error)
            Middleware->>+ResponseFactory: error(error)
            ResponseFactory-->>-Middleware: JSON Error Response
            Middleware->>-App: HTTP Error Response
            deactivate Middleware
            App-->>Client: HTTP Error Response
        end
    else Not valid email
        activate Middleware
        Middleware->>+ErrorFactory: badRequest()
        ErrorFactory->>-Middleware: error
        Middleware->>+Middleware: next(error)
        Middleware->>+ResponseFactory: error(error)
        ResponseFactory-->>-Middleware: JSON Error Response
        Middleware->>-App: HTTP Error Response
        deactivate Middleware
        App-->>-Client: HTTP Error Response
    end
```
# POST `/admin/update-token`
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant Repository
    participant DAO
    participant ErrorFactory
    participant ResponseFactory

    Client->>+App: POST /admin/recharge (email, token)
    App->>+Middleware: authenticateJWT()
    alt valid JWT
        Middleware-->>-App: next()
        App->>+Middleware: isAdmin()
        alt valid admin
            Middleware-->>-App: next()
            App->>+Middleware: emailValidationMiddleware()
            alt valid email
                Middleware-->>-App: next()
                App->>+Middleware: adminTokensValidationMiddleware()
                alt valid token
                    Middleware-->>-App: next()
                    App->>+Controller: updatePlayerTokens(email, tokens)
                    Controller->>+Service: updatePlayerTokens(email, tokens)
                    Service->>+Repository: updatePlayerField(player_id, email, tokens)
                    Repository->>+DAO: update(player_id, tokens)
                    DAO-->>-Repository: updated Player
                    Repository-->>-Service: updated Player
                    Service-->>-Controller: updated Player
                    Controller->>+ResponseFactory: success(updatedPlayer)
                    ResponseFactory-->>-Controller: JSON Response
                    Controller-->>-App: HTTP Response
                    App-->>Client: HTTP Response with updatedPlayer
                else not valid token
                    activate Middleware
                    Middleware->>+ErrorFactory: badRequest()
                    ErrorFactory->>-Middleware: error
                    Middleware->>+Middleware: next(error)
                    Middleware->>+ResponseFactory: error(error)
                    ResponseFactory-->>-Middleware: JSON Error Response
                    Middleware->>-App: HTTP Error Response
                    deactivate Middleware
                    App-->>Client: HTTP Error Response
                end
            else not valid email
                activate Middleware
                Middleware->>+ErrorFactory: badRequest()
                ErrorFactory->>-Middleware: error
                Middleware->>+Middleware: next(error)
                Middleware->>+ResponseFactory: error(error)
                ResponseFactory-->>-Middleware: JSON Error Response
                Middleware->>-App: HTTP Error Response
                deactivate Middleware
                App-->>Client: HTTP Error Response
            end
        else not valid admin
            activate Middleware
            Middleware->>+ErrorFactory: forbidden()
            ErrorFactory->>-Middleware: error
            Middleware->>+Middleware: next(error)
            Middleware->>+ResponseFactory: error(error)
            ResponseFactory-->>-Middleware: JSON Error Response
            Middleware->>-App: HTTP Error Response
            deactivate Middleware
            App-->>Client: HTTP Error Response
        end
    else not valid JWT
        activate Middleware
        Middleware->>+ErrorFactory: unauthorized()
        ErrorFactory-->>-Middleware: error
        Middleware->>+Middleware: next(error)
        Middleware->>+ResponseFactory: error(error)
        ResponseFactory-->>-Middleware: JSON Error Response
        Middleware-->>-App: HTTP Error Response
        deactivate Middleware
        App-->>-Client: HTTP Error Response
    end
```
## GET `/players/ranking`
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Repository
    participant DAO
    participant ErrorFactory
    participant ResponseFactory
    
    Client ->>+ App: Get /players/ranking?<order>
    App ->>+ Middleware: validatePlayerRanking()
    alt Valid param
        Middleware -->>- App: next()
        App ->>+ Controller: getPlayerRanking(field, order)
        Controller ->>+ Repository: findAllOrdering(field, order)
        Repository ->>+ DAO: findAll()
        DAO -->>- Repository: Player[]
        Repository -->>- Controller: Player[]
        Controller ->>+ ResponseFactory: success(players)
        ResponseFactory -->>- Controller: JSON Response
        Controller -->>- App: HTTP Response
        App -->> Client: HTTP Response with players
    else Not valid param
        activate Middleware
        Middleware ->>+ ErrorFactory: badRequest()
        ErrorFactory -->>- Middleware: error
        Middleware ->>+ Middleware: next(error)
        Middleware ->>+ ResponseFactory: error(error)
        ResponseFactory -->>- Middleware: JSON Error Response
        Middleware -->>- App: HTTP Error Response
        deactivate Middleware
        App -->>- Client: HTTP Error Response
    end
```
## GET `/games/history`
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant Repository
    participant DAO
    participant ErrorFactory
    participant ResponseFactory

    Client->>+App: GET games/history?start_date=<start_date>
    App->>+Middleware: authenticateJWT()
    alt valid JWT
        Middleware-->>-App: next()
            App->>+Middleware: dateValidationMiddleware()
            alt valid date
                Middleware-->>-App: next()
                App->>+Middleware: orderValidationMiddleware()
                alt valid order
                    App->>+Controller: gamesHistory(player_id, startDate)
                    Controller->>+Service: getGamesHistory(player_id, startDate,sort)
                    Service->>+Repository:findFinishGames()
                    Repository->>+DAO: findAll(whereClause)
                    DAO-->>-Repository: Game[]
                    Repository-->>-Service: Game[]
                    Service->>+Repository: findByPlayer(player_id, filter_field, startDate)
                    Repository->>+DAO: findAll(whereClause)
                    DAO-->>-Repository: Game[]
                    Repository-->>-Service: Game[]
                    Service-->>-Controller: Game[]
                    Controller->>+ResponseFactory: success(Game[])
                    ResponseFactory-->>-Controller: JSON Response
                    Controller-->>-App: HTTP Response
                    App-->>Client: HTTP Response with Game[]
                else not valid query
                    activate Middleware
                    Middleware->>+ErrorFactory: badRequest()
                    ErrorFactory->>-Middleware: error
                    Middleware->>+Middleware: next(error)
                    Middleware->>+ResponseFactory: error(error)
                    ResponseFactory-->>-Middleware: JSON Error Response
                    Middleware-->>-App: HTTP Error Response
                    deactivate Middleware
                    App-->>Client: HTTP Error Response
                end
            else not valid date
                activate Middleware
                Middleware->>+ErrorFactory: badRequest()
                ErrorFactory->>-Middleware: error
                Middleware->>+Middleware: next(error)
                Middleware->>+ResponseFactory: error(error)
                ResponseFactory-->>-Middleware: JSON Error Response
                Middleware->>-App: HTTP Error Response
                deactivate Middleware
                App-->>Client: HTTP Error Response
            end
    else not valid JWT
        activate Middleware
        Middleware->>+ErrorFactory: unauthorized()
        ErrorFactory-->>-Middleware: error
        Middleware->>+Middleware: next(error)
        Middleware->>+ResponseFactory: error(error)
        ResponseFactory-->>-Middleware: JSON Error Response
        Middleware-->>-App: HTTP Error Response
        deactivate Middleware
        App-->>-Client: HTTP Error Response
    end
```
## POST `/games/create`
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant Repository
    participant DAO
    participant ErrorFactory
    participant ResponseFactory
    
    Client ->>+ App: POST /games/create (player2, AI_difficulty)
    App ->>+ Middleware: authenticateJWT()
    alt valid JWT
        Middleware -->>- App: next()
        App ->>+ Middleware: gameValidationMiddleware()
        alt valid game
            Middleware -->>- App: next()
            App ->>+ Controller: createGame(player2, AI_difficulty)
            Controller ->>+ Service: createGame(player1, player2, AI_difficulty)
            Service ->>+ Service: checkSufficientTokens(player1, tokens)
            alt enough tokens
                deactivate Service
                Service ->>+ Repository: findByEmail(player2)
                Repository ->>+ DAO: findOne()
                alt player found
                    DAO -->>- Repository: Player
                    Repository -->>- Service: Player
                    Service ->>+ Repository: create(game_details)
                    Repository ->>+ DAO: create(game_details)
                    DAO -->>- Repository: Game
                    Repository -->>- Service: Game
                    Service ->>+ Service: playerService.decrementTokens(player1, tokens)
                    Service -->>- Controller: Game
                    deactivate Service
                    Controller ->>+ ResponseFactory: success(game)
                    ResponseFactory -->>- Controller: JSON Response
                    Controller -->>- App: HTTP Response
                    App -->> Client: HTTP Response with game
                else player not found
                    activate Service
                    Service ->>+ ErrorFactory: notFound()
                    ErrorFactory -->>- Service: error
                    Service -->>+ Controller: error
                    deactivate Service
                    Controller ->>+ Middleware: next(error)
                    deactivate Controller
                    Middleware ->>+ ResponseFactory: error(error)
                    ResponseFactory -->>- Middleware: JSON Error Response
                    Middleware -->>- App: HTTP Error Response
                    App -->> Client: HTTP Error Response
                end
                else not enough tokens
                    activate Service
                    Service ->>+ ErrorFactory: notEnoughTokens()
                    ErrorFactory -->>- Service: error
                    Service -->>+ Controller: error
                    deactivate Service
                    Controller ->>+ Middleware: next(error)
                    deactivate Controller
                    Middleware ->>+ ResponseFactory: error(error)
                    ResponseFactory -->>- Middleware: JSON Error Response
                    Middleware -->>- App: HTTP Error Response
                    App -->> Client: HTTP Error Response
                end
            activate Service
            Service ->>+ Repository: createGame(player1, player2, AI_difficulty)
            Repository ->>+ DAO: create(player1, player2, AI_difficulty)
            DAO -->>- Repository: Game
            Repository -->>- Service: Game
            Service -->>+ Controller: Game
            deactivate Service
            Controller ->>+ ResponseFactory: success(game)
            ResponseFactory -->>- Controller: JSON Response
            Controller -->>- App: HTTP Response
            App -->> Client: HTTP Response with game
        else not valid game
            activate Middleware
            Middleware ->>+ ErrorFactory: badRequest()
            ErrorFactory -->>- Middleware: error
            Middleware ->>+ Middleware: next(error)
            Middleware ->>+ ResponseFactory: error(error)
            ResponseFactory -->>- Middleware: JSON Error Response
            Middleware -->>- App: HTTP Error Response
            deactivate Middleware
            App -->>- Client: HTTP Error Response
        end
    else not valid JWT
        activate Middleware
        Middleware ->>+ ErrorFactory: unauthorized()
        ErrorFactory -->>- Middleware: error
        Middleware ->>+ Middleware: next(error)
        Middleware ->>+ ResponseFactory: error(error)
        ResponseFactory -->>- Middleware: JSON Error Response
        Middleware -->>- App: HTTP Error Response
        deactivate Middleware
        App -->> Client: HTTP Error Response
    end
```

## GET /games/win-certificate/:gameId
```mermaid
sequenceDiagram
actor Client
participant App
participant Middleware
participant Controller
participant Service
participant Repository
participant DAO
participant ErrorFactory
participant ResponseFactory

    Client ->>+ App: GET /games/win-certificate/:gameId
    App ->>+ Middleware: authenticateJWT()
    alt valid JWT
        Middleware -->>- App: next()
        App ->>+ Middleware: gameIdValidationMiddleware()
        alt valid gameID
            Middleware -->>- App: next()
            App ->>+ Controller: getWinCertificate(gameId)
            Controller ->>+ Service: getWinCertificate(playerId, game_id)
            Service ->>+ Repository: findWonGameByIds(player_id, game_id)
            Repository ->>+ DAO: findOne(whereClause)
            DAO -->>- Repository: Game
            Repository -->>- Service: Game
            Service -->>- Controller: Buffer
            Controller ->>+ ResponseFactory: pdf(buffer)
            ResponseFactory -->>- Controller: JSON Response
            Controller -->>- App: HTTP Response
        else not valid gameID
            activate Middleware
            Middleware ->>+ ErrorFactory: badRequest()
            ErrorFactory -->>- Middleware: error
            Middleware ->>+ Middleware: next(error)
            Middleware ->>+ ResponseFactory: error(error)
            ResponseFactory -->>- Middleware: JSON Error Response
            Middleware -->>- App: HTTP Error Response
            deactivate Middleware
            App -->>- Client: HTTP Error Response
        end
    else not valid JWT
        activate Middleware
        Middleware ->>+ ErrorFactory: unauthorized()
        ErrorFactory -->>- Middleware: error
        Middleware ->>+ Middleware: next(error)
        Middleware ->>+ ResponseFactory: error(error)
        ResponseFactory -->>- Middleware: JSON Error Response
        Middleware -->>- App: HTTP Error Response
        deactivate Middleware
        App -->> Client: HTTP Error Response
    end
```

## GET /games/details/:gameId/:format?

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Strategy
    participant Service
    participant Repository
    participant DAO
    participant ErrorFactory
    participant ResponseFactory

    Client ->>+ App: GET /details/:gameId/:format?
    App ->>+ Middleware: authenticateJWT()
    alt valid JWT
        Middleware -->>- App: next()
        App ->>+ Middleware: gameIdValidationMiddleware()
        alt valid gameID
            Middleware -->>- App: next()
            App ->>+ Middleware: exportFormatValidationMiddleware()
            alt valid export Format
                Middleware -->>- App: next()
                App ->>+ Controller: getGameHistory(gameId,format)
                Controller ->>+ Service: getGameMoves(playerId, gameId)
                Service ->>+ Repository: findById(gameId)
                Repository ->>+ DAO: findAll(whereClause)
                DAO -->>- Repository: Game
                Repository -->>- Service: Game
                Service ->>+ Repository : findByGame(gameId)
                Repository ->>+ DAO: findAll(whereClause)
                DAO -->>- Repository : Move
                Repository -->>- Service: Move
                Service ->>+ Repository : findById(player_1_id)
                Repository ->>+ DAO : findOne(whereClause)
                DAO -->>- Repository : Player
                Repository -->>- Service: Player
                Service ->>+ Repository : findById(player_2_id)
                Repository ->>+ DAO : findOne(whereClause)
                DAO -->>- Repository : Player
                Repository -->>- Service: Player
                Service -->>- Controller: Moves info
                Controller ->>+ Strategy: export(Moves info)
                Strategy -->>- Controller: buffer
                Controller ->>+ ResponseFactory: pdf/success(buffer)
                ResponseFactory -->>- Controller: JSON Response
                Controller -->>- App: HTTP Response
                App -->> Client: HTTP Response with buffer
            else not valid export Format
                activate Middleware
                Middleware ->>+ ErrorFactory: badRequest()
                ErrorFactory -->>- Middleware: error
                Middleware ->>+ Middleware: next(error)
                Middleware ->>+ ResponseFactory: error(error)
                ResponseFactory -->>- Middleware: JSON Error Response
                deactivate Middleware
                Middleware -->>- App: HTTP Error Response
                App -->> Client: HTTP Error Response
            end
        else not valid gameID
            activate Middleware
            Middleware ->>+ ErrorFactory: unauthorized()
            ErrorFactory -->>- Middleware: error
            Middleware ->>+ Middleware: next(error)
            Middleware ->>+ ResponseFactory: error(error)
            ResponseFactory -->>- Middleware: JSON Error Response
            Middleware -->>- App: HTTP Error Response
            deactivate Middleware
            App -->> Client: HTTP Error Response
        end
    else not valid JWT
        activate Middleware
        Middleware ->>+ ErrorFactory: unauthorized()
        ErrorFactory -->>- Middleware: error
        Middleware ->>+ Middleware: next(error)
        Middleware ->>+ ResponseFactory: error(error)
        ResponseFactory -->>- Middleware: JSON Error Response
        Middleware -->>- App: HTTP Error Response
        deactivate Middleware
        App -->>- Client: HTTP Error Response
    end

```


