# Finance Dashboard Backend

## Overview
This is a robust backend system for a Finance Dashboard built with Node.js, Express, MongoDB, and Redis. It provides comprehensive APIs for user management, role-based access control (RBAC), financial records tracking, and dashboard summaries. The application leverages JWT for secure authentication and Redis for caching data to optimize API performance.

## Features
- **User Authentication & Authorization**: Secure login and registration using JWT and bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Viewer`, `Analyst`, and `Admin` roles.
- **Financial Records Management (CRUD)**: Create, Read, Update, and Delete operations for financial data.
- **Dashboard Summaries**: Dedicated endpoints for generating financial summaries and statistics.
- **Data Caching**: Integrated Redis caching to speed up data retrieval.
- **Data Validation**: Secure and rigorous input validation.

## Prerequisites
Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

## Technologies Used
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Caching:** Redis
- **Security:** JSON Web Tokens (JWT), Bcrypt, CORS
- **Environment Management:** Dotenv

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd Finance_Dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the necessary environment variables. The file should look similar to this:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the Application:**
   For development (uses nodemon, if configured in package.json):
   ```bash
   npm run dev
   ```
   *Note: If no start script is defined, use `node src/index.js` or `npx nodemon src/index.js`.*

## Core API Structure

### User Routes (`/api/users`)
Handles authentication and user management operations. Expect typical endpoints such as:
- `POST /api/users/register` - Create a new user.
- `POST /api/users/login` - Authenticate user and return a JWT.

### Finance Routes (`/api/finance`)
Handles the core financial records logic and data retrieval for the dashboard:
- `POST /api/finance/` - Add a new financial record.
- `GET /api/finance/` - Retrieve financial records.
- `PUT /api/finance/:id` - Update a specific financial record.
- `DELETE /api/finance/:id` - Delete a specific financial record.
- `GET /api/finance/summary` - Fetch dashboard summary and statistics.

## Project Structure

```
Finance_Dashboard/
├── src/
│   ├── config/       # Database (MongoDB, Redis) connections
│   ├── controllers/  # Request handlers and business logic
│   ├── middleware/   # Custom middlewares (e.g., auth, role validation)
│   ├── models/       # Mongoose generic schemas
│   ├── routes/       # Express route definitions
│   ├── utils/        # Helper functions (e.g., validation, generate tokens)
│   └── index.js      # Application entry point
├── package.json      # Project metadata and dependencies
├── .env              # Environment configurations (not committed)
└── README.md         # Project documentation
```
