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
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=ecommerce_db
JWT_SECRET=your_jwt_secret
```

### Backend 
1. ```cd server```
2. ```npm install``` 
3. ```npm run dev```