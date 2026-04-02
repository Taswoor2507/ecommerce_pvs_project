# Ecommerce PVS
Full-stack e-commerce project built with React (frontend) and Node.js/Express (backend) with PostgreSQL database.

## Project Structure
- `client/` → ReactJS app
- `server/` → Node.js/Express API

## Backend Setup Instructions

### Environment Variables
Before starting the backend, create a `.env` file inside `server/` folder and add the following:

```env
# Backend (.env)
PORT= ****
FRONTEND_URL= http://localhost:***8
NODE_ENV = "development"
MONGO_URI = "mongodb://localhost:*****/"
DB_NAME = "****"
ACCESS_TOKEN_SECRET= "your_secret"
REFRESH_TOKEN_SECRET ="your_secret"
```

### Backend 
1. ```cd server```
2. ```npm install``` 
3. ```npm run dev```

## Auth Routes
> #### Register user 
1. ``` localhost:8080/api/v1/register  ```
    ##### Payload
    1. ``` name ```
    2. ``` email ```
    3. ``` password (HINT:Password must be at least 8 characters long, include at least one uppercase letter and one special character (e.g., Pass@123). )```
> #### Login user 
2. ``` localhost:8080/api/v1/login  ```
    ##### Payload
    1. ``` name ```
    2. ``` email ```
    3. ``` password```
