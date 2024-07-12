

<p align="center">
  <img src="./img/logo.png" width="256">
</p>

---

<p align="center">
<img src="https://forthebadge.com/images/badges/built-with-love.svg">
<img src="https://forthebadge.com/images/badges/made-with-typescript.svg">
<img src="https://forthebadge.com/images/badges/cc-0.svg">
<img src="https://forthebadge.com/images/badges/works-on-my-machine.svg">
<br>
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white">
<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=blue">
<img src="https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=F0F0F0">
<img src="https://img.shields.io/badge/Fedora-294172?style=for-the-badge&logo=fedora&logoColor=white">
</p>

## POST `/login`

The login route is used to authenticate a user. The user must provide an email and a password in the request body. The email is used to find the player in the database and the password is used to authenticate the player. If the player is successfully authenticated, a JWT token is generated and returned to the player.

[//]: # (### Request body example)

[//]: # ()
[//]: # (```json)

[//]: # ({)

[//]: # (  "email": "email@example.com",)

[//]: # (  "password": "password")

[//]: # (})

[//]: # (```)

[//]: # ()
[//]: # (### Response example)

[//]: # ()
[//]: # (```json)

[//]: # ({)

[//]: # (  ")

[//]: # (    token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiZm9vIiwiaWF0IjoxNjI5MzUwNzQ4LCJleHAiOjE2MjkzNTA3NDh9.7")

[//]: # (})

[//]: # (```)

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
        Controller -->>+ Repository: findAllOrdering(field, order)
        Repository -->>+ DAO: findAll()
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
## GET /games/history

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
                    App->>+Controller: gamesHistory(player_id, startDate)
                    Controller->>+Service: getGamesHistory(player_id, startDate)
                    Service->>+Repository: findByPlayer(player_id, filter_field, startDate)
                    Repository->>+DAO: findAll(whereClause)
                    DAO-->>-Repository: Game[]
                    Repository-->>-Service: Game[]
                    Service-->>-Controller: Game[]
                    Controller->>+ResponseFactory: success(Game[])
                    ResponseFactory-->>-Controller: JSON Response
                    Controller-->>-App: HTTP Response
                    App-->>Client: HTTP Response with Game[]
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


