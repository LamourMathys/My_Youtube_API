<img src="API/public/Logo_moche.png" align="center" alt="YTAPI Logo" width="120" style="border-radius: 12px; margin-bottom: 10px;">  

# My_YT_api

 <p>
    <a href="https://ytapi.mathyslamour.fr"><img src="https://img.shields.io/badge/Live_Demo-ytapi.mathyslamour.fr-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo"></a>
    <a href="https://documenter.getpostman.com/view/58462489/2sBYB2rSm5#intro"><img src="https://img.shields.io/badge/Postman-Documentation-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman Docs"></a>
    <a href="https://ytapi.mathyslamour.fr/api-docs"><img src="https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger Docs"></a>
 </p>

## Features of the project

### This project was about making an API where we had to find a topic,get a lot of row data, and we had specification to respect:

- **User authentification in order to administer the data**

- **OAuth login**

- **CRUD requests**

- **Get must have a pagination with a maximum of 20 elements**

- **Redis cache**

- **Documentation with swagger**

- **Postman Documentation**

##  Tech Stack
- **Runtime** : Node.js
- **Framework** : Express.js
- **Cache** : Redis 
- **Authentication and security** : Bcrypt, Google OAuth 2.0, JWT
- **Documentation** : Swagger UI Express, OpenAPI 3.0, Postman
- **DevOps** : Docker & Docker Compose

### Project Structure
---
```mermaid
mindmap
  root((API))
    config[" config (Redis)"]
    controller[" controller (CRUD, Auth)"]
    middleware[" middleware (Auth & Cache)"]
    public[" public (Web static)"]
    routes[" routes (Express)"]
    index[" index.js"]
    swagger[" swagger.json"]
    docker[" Docker & Compose"]
```

### End Point
---
### Authentification

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/login` | Admin login (username + password) ➔ Returns a JWT token |
| `GET` | `/auth/login` | Redirecting to the Google OAuth authentication page |
| `GET` | `/auth/callback` | Callback Google OAuth |


### YTAPI

| Méthode | Route | Auth requise | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/YTAPI?page=1` |  No | Paginated list of creators (20 per page, cached) |
| `GET` | `/YTAPI/:id` |  No | Creator details by ID (cached) |
| `POST` | `/YTAPI` |  yes | Add a new creator (name, subscribers, theme) |
| `PUT` | `/YTAPI/:id` |  yes | Update a creator's information |
| `DELETE` | `/YTAPI/:id` |  yes | Delete a creator |

---

### GitHub : <a href="https://github.com/LamourMathys">LamourMathys</a>