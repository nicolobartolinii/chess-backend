

<p align="center">
  <img src="./img/logo.png" width="256">
</p>

---

<p align="center">
<img src="https://forthebadge.com/images/badges/built-with-love.svg">
<img src="https://forthebadge.com/images/badges/made-with-typescript.svg">
<img src="https://forthebadge.com/images/badges/cc-0.svg">
<br>
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white">
<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=blue">
</p>

# Prograamazione -Avanzata UNIVPM 2023/24
####  The Advanced Programming project for the Computer and Automation Engineering course 2023/24 at the Polytechnic University of Marche

## Table of Contents
- [Project goals](#Project-goals)
- [Used tools](#usedTools)
- [Pattern used](#pattern)
  - [Singleton](#singleton)
  - [Sequalize](#sequelize)
    - [DAO](#dao)
  - [Repository](#repository)
  - [Strategy](#strategy)
  - [Factory](#factory)
  - [ModelViewController](#modelViewController)
  - [Middleware](#middleweare)
- [Routes](#Routes) 
  - [POST `/login`](#login)
- [UML diagrams](#umldiagrams)
  - [uses case](#usecase)
  - [sequenzadiagrams](#sequenzadiagrams)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)


# Use Case Diagram
<img src="./img/usecase.png">


# Project-goals

Here is a professional, cohesive translation of the project objectives for your advanced programming course into English:

The  goal of this project is to implement a robust backend system that enables authenticated users to create and play chess games, both against artificial intelligence and other users. The system incorporates several key features designed to enhance user experience and functionality:

## Key Features

- **Game Creation**: Users can start new chess matches utilizing the js-chess-engine, choosing either to face AI at varying levels of difficulty or to challenge other authenticated users. This flexibility supports a wide range of player skills and preferences.

- **Game Management**: The system adeptly handles multiple active games simultaneously. It ensures that a user participates in only one game at a time. Each activity within the platform, from creating games to making moves, incurs a deduction of tokens from the user's account based on a pre-defined tariff.

- **Game History**: Participants can access and review their completed games' history, which includes an comprehensive game details in PDF or Json format.

- **Player Ranking**: The system provides a feature to view the ranking by score of all players.

- **Admin Token Recharge**: Administrators have the ability to recharge tokens for other users.

- **Victory Certification**: Players can view a certificate of victory for each game won.

- **Additional Features**: Detailed analysis of further functionalities will be discussed in the "Routes" chapter, which includes the technical specifics and implementation details of each feature.


[//]: # (L'obiettivo principale di questo progetto è quello di implementare un sistema di backend robusto che permetta agli utenti autenticati di creare e giocare partite di scacchi, sia contro l'intelligenza artificaile sia contro altri utenti.)

[//]: # (In particolare le caratteristiche che ha sono:)

[//]: # (Creazione delle Partite: Gli utenti possono iniziare nuove partite di scacchi utilizzando il js-chess-engine, scegliendo tra giocare contro l'IA a vari livelli di difficoltà o contro altri utenti autenticati.)

[//]: # (Gestione delle Partite: Il sistema gestirà simultaneamente più partite attive, assicurando che gli utenti possano partecipare a una sola partita alla volta. Ogni azione, come la creazione di partite e l'esecuzione di mosse, dedurrà token dal conto dell'utente secondo un tasso predefinito.)

[//]: # (Storico delle Partite: Gli utenti possono visualizzare lo storico delle partite completate, con la possibilità di scaricare i dettagli delle partite in formato PDF.)




# Routes

| Route                                    | Method | Description                                          | JWT Authentication |
|------------------------------------------|--------|------------------------------------------------------|--------------------|
| /login                                   | POST   | Do a login                                           | Yes                |
| /admin/update-tokens                     | POST   | Admin can Recharge a user's credits                  | Yes                |
| /players/ranking                         | GET    | An User can view the ranking by score of all players | No                 |
| /games/create                            | POST   | Users can start new chess matches                    | Yes                |
| /games/history                           | GET    | Get all finish match from current player             | Yes                |
| /games/:gameId/status                    | GET    | Get current status of a specific chess game          | Yes                |
| /games/:gameId/win-certificate           | GET    | Get certificate from victory a match                 | Yes                | 
| /games/:gameId/move                      | POST   | Make a move in the game                              | Yes                | 
| /games/:gameId/chessboard                | GET    | Get the last game configuration of the match         | Yes                |
| /games/:gameId/details?format=<pdf/json> | GET    | Get the game details                                 | Yes                |
| /games/:gameId/abandon                   | POST   | Quit a match                                         | Yes                |


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

## GET `/players/ranking?field=points&order=ASC`

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


