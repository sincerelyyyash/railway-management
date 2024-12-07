# Railway Management Server

## Project Overview

The **Railway Management Server** is a backend service designed to manage train bookings, seat availability, and user management for a railway system. It is built using **Node.js**, **Express** with **Typescript**, and **Prisma** as the ORM, and uses **PostgreSQL** as the database. The project includes authentication, role-based access control, and a seeding mechanism for initial data setup.

---

## Features

- **User Management**: Register, login, and manage users with roles (`ADMIN`, `USER`).
- **Train Management**: Add, update, and manage train routes and seat availability.
- **Booking System**: Users can book train seats and view booking details.
- **Role-Based Access**: Admin-only operations like creating new trains.
- **Secure Authentication**: JSON Web Tokens (JWT) for secure API access.

---

## Tech Stack

- **Node.js**: Backend runtime
- **Language**: Typescript
- **PostgreSQL**: Relational database
- **Prisma**: ORM for database operations
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT-based authentication

---

## Project Setup

### Prerequisites

- **Node.js** (>= 16.x)
- **PostgreSQL** (>= 12.x)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sincerelyyyash/railway-management.git
   cd railway-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file:
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
   JWT_TOKEN=your-secret-jwt-key
   ADMIN_API_KEY=your-admin-api-key
   PORT=port-value-here
   ```

4. Set up the database with Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### Authentication & User Management

| Method | Endpoint              | Description             | Access    |
|--------|-----------------------|-------------------------|-----------|
| POST   | `/api/v1/user/login`              | User login             | Public    |
| POST   | `/api/v1/user/register`           | User registration      | Public    |

### Train Management

| Method | Endpoint              | Description             | Access    |
|--------|-----------------------|-------------------------|-----------|
| POST   | `/api/v1/train/create-train`       | Add a new train         | Admin     |
| GET    | `/api/v1/train/seat-availability`  | Check seat availability | Authenticated |

### Booking Management

| Method | Endpoint                  | Description               | Access    |
|--------|---------------------------|---------------------------|-----------|
| POST   | `/api/v1/train/book-seat`              | Book a seat               | Authenticated |
| GET    | `/api/v1/train/booking-details/:id`    | View booking details      | Authenticated |

---

## Scripts

| Script         | Command                 | Description                          |
|----------------|-------------------------|--------------------------------------|
| **Start**      | `npm start`            | Starts the server in production mode |
| **Dev**        | `npm run dev`          | Runs the server in development mode  |
| **Build**      | `npm run build`        | Compiles TypeScript to JavaScript    |
| **Seed**       | `npm run seed`         | Seeds the database with initial data|

---

## Project Structure

```
.
├── prisma                  # Prisma schema and migrations
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── src
│   ├── controllers         # API controllers
│   ├── middlewares         # Express middlewares
│   ├── routes              # API routes
│   ├── utils               # Utility functions
│   ├── app.ts              # Cors & routes declaration
│   └── index.ts            # Server entry point
├── .env                    # Environment variables
├── package.json            # Project configuration
└── README.md               # Project documentation
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---
