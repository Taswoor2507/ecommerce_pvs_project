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