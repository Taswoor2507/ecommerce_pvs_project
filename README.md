# Ecommerce PVS 🚀

Ecommerce PVS is a robust, full-stack e-commerce platform designed with high performance, scalability, and concurrency in mind. Leveraging the **MERN (MongoDB, Express, React, Node.js)** stack and integrated with **Redis**, it provides a seamless shopping experience with advanced features like product variant management and real-time stock handling.

## 🏗️ Architecture

The project is divided into two main parts:
- **`server/`**: A Node.js and Express-based RESTful API.
- **`client/`**: A modern React-based frontend using Vite for high-speed development and deployment.

## ✨ Key Features

- **Authentication**: Secure JWT-based registration and login system with refresh token support.
- **Product Management**: Support for products with and without variants (colors, sizes, etc.).
- **Variant Combinations**: Advanced logic to handle multidimensional product variants.
- **Real-time Performance**: Redis integration for caching and distributed locking to ensure consistent stock management.
- **Swagger Documentation**: Live API documentation integrated directly into the backend for easy testing and integration.
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS.
- **Modern Tech Stack**: React Query for state management, Zod for validation, and React Hook Form for efficient forms.

## ⚙️ Tech Stack

### Backend
- **Node.js & Express**: Core server framework.
- **MongoDB & Mongoose**: Flexible, document-oriented database.
- **Redis (ioredis)**: High-performance caching and distributed locking.
- **JWT**: Secure user sessions.
- **Swagger**: API documentation (Swagger UI).
- **Zod**: Robust request body and schema validation.

### Frontend
- **React (Vite)**: Lightning-fast frontend development.
- **Tailwind CSS**: Modern utility-first styling.
- **TanStack React Query**: Server state management and caching.
- **Lucide React**: Premium icon set.
- **React Hook Form & Zod**: Schema-based form validation.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [MongoDB](https://www.mongodb.com/) (running instance — **see important note below**)
- [Redis](https://redis.io/) (running instance)

---

## ⚠️ Important: MongoDB Replica Set Requirement

This project uses **MongoDB Transactions** (via Mongoose), which require MongoDB to be running as a **Replica Set**. A standalone MongoDB instance (like the default local install or MongoDB Compass without a replica set) will **not** work — the server will fail to respond on transaction-based routes.

You have two options:

---

### ✅ Option 1 — Use MongoDB Atlas (Recommended & Easiest)

MongoDB Atlas provides a **free tier cluster** that runs as a replica set out of the box.

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a free **M0 cluster**.
3. Get your connection string (it looks like `mongodb+srv://...`).
4. Paste it as `MONGO_URI` in your `.env` file.

That's it — no extra setup needed.

---

### ✅ Option 2 — Run MongoDB Locally as a Replica Set

If you prefer to run MongoDB locally, you must start it in **replica set mode**. Use the command for your operating system:

#### 🐧 Linux
```bash
sudo systemctl stop mongod
sudo rm -f /tmp/mongodb-27017.sock
mongod --dbpath /data/db --replSet rs0
```

#### 🍎 macOS
```bash
brew services stop mongodb-community
mongod --config /usr/local/etc/mongod.conf --replSet rs0
```
> If `/data/db` doesn't exist, create it first: `sudo mkdir -p /data/db && sudo chown $(whoami) /data/db`

#### 🪟 Windows (run in CMD or PowerShell as Administrator)
```powershell
net stop MongoDB
mongod --dbpath "C:\data\db" --replSet rs0
```

---

#### After Starting the Replica Set (First Time Only)

Once `mongod` is running, open a **new terminal** and run:

```bash
mongosh
```

Then inside the shell:

```js
rs.initiate()
```

You should see `{ ok: 1 }`. Your replica set is now ready.

---

> **🚨 Important Warning:** If you are using **Option 2 (local replica set)**, do **NOT close the terminal** where `mongod` is running. Closing it will stop the MongoDB process, and the server will fail to handle transactions. Keep that terminal open for the entire development session.

---

### 1. Server Setup

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=8080

   # Set this to the URL where your frontend is running, otherwise you will get CORS errors.
   FRONTEND_URL=http://localhost:5173

   NODE_ENV=development

   # Database
   # Option 1 — MongoDB Atlas (Recommended): replace with your Atlas connection string
   #   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
   # Option 2 — Local Replica Set: MongoDB must be running with --replSet rs0 (see above)
   #   Do NOT use MongoDB Compass standalone — transactions require a replica set.
   MONGO_URI=mongodb://localhost:27017/
   DB_NAME=ecommerce1

   # Authentication — replace these with your own long random secrets in production
   ACCESS_TOKEN_SECRET=sahkdgsh348y9328SASASHJAkjgssdfghjGYUETYUTREUGJgjeqwueiqwegh
   REFRESH_TOKEN_SECRET=dasldkjHKJASDHASJDGJHASKJADH4382463563485983yskfhsfjkgf

   # Redis — must be running locally before starting the server (redis-server)
   # On Linux/macOS: redis-server
   # On Windows: run Redis via WSL or the Redis Windows installer
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_DISABLED=false

   # REDIS_PASSWORD is NOT used in this project.
   # In a production environment, it is highly recommended to set a Redis password.
   # REDIS_PASSWORD=your_redis_password
   ```

4. **Seed the database (Optional)**:
   ```bash
   npm run seed
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```
   *The server will be running on [http://localhost:8080](http://localhost:8080)*

---

### 2. Client Setup

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1

   # This must match the FRONTEND_URL set in server/.env, otherwise you will get CORS errors.
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The frontend will be running on [http://localhost:5173](http://localhost:5173)*

---

## ERD Diagram

You can find the database schema here:

[View ERD Diagram](https://drive.google.com/file/d/1rxHvc4NbtjQF8oKCrKHKkI95se4VD4G4/view?usp=sharing)





## 🔍 API Documentation

The API follows a standard RESTful architecture. All available endpoints — including auth, products, variants, combinations, and stock management — can be explored and tested directly through the integrated **Swagger UI**:

- **Swagger Docs**: `http://localhost:{PORT}/api-docs` — replace `{PORT}` with the port set in your `server/.env` (default: `http://localhost:8080/api-docs`)

> Swagger is the recommended way to test and explore the full API. All routes are documented there with request/response schemas.

### Core Auth Endpoints
- `POST /api/v1/auth/register` — Register a new user.
- `POST /api/v1/auth/login` — Authenticate and receive tokens.
- `POST /api/v1/auth/logout` — Clear session tokens.

---

# 🔐 Role-Based Access Control (Admin Access Required)

This project implements role-based authorization to protect sensitive routes such as product management, variant creation, and stock handling.

## 👤 Default User Role
When a user registers:

`POST /api/v1/auth/register`

They are assigned the default role:

```json
{
  "role": "user"
}
```

#### So manually update it with admin role if you want to test admin features.

## 🛠️ Key Components & Concurrency

### Distributed Locking with Redis
The project implements a robust distributed locking mechanism to handle concurrent operations, particularly during automated variant combination generation.

- **Mechanism**: Uses a custom `withProductLock` utility that leverages Redis' atomic `SET ... NX PX` command to acquire exclusive locks.
- **Safety**: Ownership is verified using a unique `lockValue` (PID + Timestamp + Random) and released via an atomic Lua script to ensure a process only deletes its own lock.
- **Resilience**: Implements retry logic with a 500ms backoff and a 15-second TTL to prevent deadlocks in case of unexpected process failures.
- **Use Case**: Prevents race conditions when multiple administrators or automated processes attempt to regenerate product variants/combinations simultaneously.

### Advanced Product Variants (PVS)
The system is designed to handle complex product structures efficiently:
- **Product Model**: Supports both simple items and complex items with nested variants.
- **Combinations**: Automatically generates all possible SKU combinations (e.g., Red + Small, Blue + Large) while maintaining individual stock and pricing for each.

### Schema Validation
Both backend (Express) and frontend (React) use **Zod** for schema validation. This ensures data integrity across the entire stack, reducing runtime errors and improving developer productivity.

Thanks ...