# 🎬 Cinemax — Movie Reservation System

A full-stack movie reservation web application built with **Spring Boot** and **React**. Users can browse films, view sessions, select seats, and complete reservations with a timed checkout flow. Administrators manage movies (imported from OMDB), sessions, and cinema rooms through a dedicated dashboard.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | [https://moviereservation-site.onrender.com](https://moviereservation-site.onrender.com) |
| Backend API | [https://moviereservation-1.onrender.com/api](https://moviereservation-1.onrender.com/api) |

> **Note:** The application is hosted on Render's free plan. If the services have been inactive for more than 15 minutes, the first request may take up to 30 seconds to respond while the server wakes up.

### Default admin credentials

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin12345` |

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend](#backend-spring-boot)
  - [Frontend](#frontend-react)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Known Limitations](#known-limitations)

---

## Features

### Public
- Browse all available films with poster, genre, description and trailer
- View upcoming sessions grouped by date
- Search and filter sessions by film

### Authenticated Users
- Interactive seat map per session (available / selected / occupied)
- Create reservations with a **10-minute payment countdown**
- Automatic seat release when the timer expires
- Checkout and confirm payment

### Administrators
- Import films directly from the **OMDB API** by title search
- Create, edit, and delete sessions (showtime, price, room)
- Manage cinema rooms and seat capacity
- Dashboard with total reservations and revenue

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA |
| Authentication | JWT (Auth0 java-jwt) |
| External API | OpenFeign → OMDB API and IMDBapi.dev |
| Database | PostgreSQL (or H2 for local dev) |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |

---

## Project Structure

```
cinemax/
├── backend/
│   └── src/main/java/com/movie/system/
│       ├── controller/          # REST endpoints
│       ├── service/             # Business logic
│       ├── model/               # JPA entities
│       ├── repository/          # Spring Data interfaces
│       ├── dto/                 # Request / response objects
│       ├── security/            # JWT filter, SecurityConfig
│       └── client/              # Feign client
│
└── frontend/
    └── src/
        ├── pages/               # Route-level components
        ├── components/          # Shared UI components
        ├── services/            # Axios API calls
        ├── hooks/               # useAuth context
        └── types/               # TypeScript interfaces
```

---

## Prerequisites

Make sure you have the following installed:

- **Java 21+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **PostgreSQL 14+** — [Download](https://www.postgresql.org/) *(or use H2 for a quick local start)*
- An **OMDB API key** — [Get one free at omdbapi.com](https://www.omdbapi.com/apikey.aspx)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cinemax.git
cd cinemax
```

---

### Backend (Spring Boot)

#### 2. Configure the database

Create a PostgreSQL database:

```sql
CREATE DATABASE cinemax;
```

#### 3. Set up `application.properties`

Create `backend/src/main/resources/application.properties` with your values:

```properties
spring.application.name=cinemax

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/cinemax
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
api.security.token.secret=your_super_secret_jwt_key_min_32_chars

# OMDB
omdb.api.key=your_omdb_api_key
```

> **Tip:** For a quick start without PostgreSQL, replace the datasource config with H2:
> ```properties
> spring.datasource.url=jdbc:h2:mem:cinemax
> spring.datasource.driver-class-name=org.h2.Driver
> spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
> ```

#### 4. Seed initial roles

The application requires `ROLE_USER` and `ROLE_ADMIN` to exist in the database before registering users. Run this SQL once after the tables are created:

```sql
INSERT INTO role (name) VALUES ('ROLE_USER');
INSERT INTO role (name) VALUES ('ROLE_ADMIN');
```

#### 5. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

### Frontend (React)

#### 6. Install dependencies

```bash
cd frontend
npm install
```

#### 7. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> The frontend expects the backend running on `http://localhost:8080`. If your backend runs on a different port, update `src/services/api.ts`.

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `spring.datasource.url` | `application.properties` | PostgreSQL connection string |
| `spring.datasource.username` | `application.properties` | Database username |
| `spring.datasource.password` | `application.properties` | Database password |
| `api.security.token.secret` | `application.properties` | JWT signing secret (min. 32 chars) |
| `omdb.api.key` | `application.properties` | OMDB API key for movie imports |

---

## API Overview

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive a JWT |

### Movies

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/movies` | Public | List all movies |
| `GET` | `/movies/{id}` | Public | Get movie details |
| `GET` | `/movies/search?query=` | Admin | Search OMDB by title |
| `POST` | `/movies/import?imdbId=` | Admin | Import a movie from OMDB |
| `PUT` | `/movies/{id}` | Admin | Update movie details |
| `DELETE` | `/movies/{id}` | Admin | Delete a movie |

### Sessions (Showtimes)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/showtimes` | Public | List upcoming sessions |
| `GET` | `/showtimes/{id}` | Public | Get session details |
| `GET` | `/showtimes/movie/{id}` | Public | Sessions for a film |
| `POST` | `/showtimes` | Admin | Create a session |
| `PUT` | `/showtimes/{id}` | Admin | Update a session |
| `DELETE` | `/showtimes/{id}` | Admin | Delete a session |

### Seats

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/seats/availability?showTimeId=` | Public | Seat map for a session |

### Reservations

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/reservations` | User | Create a reservation |
| `GET` | `/reservations/{id}` | User | Get reservation details |
| `POST` | `/reservations/{id}/checkout` | User | Confirm payment |
| `GET` | `/reservations/admin/dashboard` | Admin | Stats and all reservations |

### Cinema Rooms

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/cinema-rooms` | Admin | List all rooms |
| `POST` | `/cinema-rooms` | Admin | Create a room |
| `DELETE` | `/cinema-rooms/{id}` | Admin | Delete a room |

---

## Authentication

The API uses **stateless JWT authentication**.

1. Register at `POST /api/auth/register`
2. Login at `POST /api/auth/login` — you receive a token
3. Include the token in every subsequent request:

```
Authorization: Bearer <your_token>
```

Tokens expire after **2 hours**. The frontend stores the token in `localStorage` and attaches it automatically via an Axios interceptor.

---

## User Roles

| Role | Capabilities |
|---|---|
| `ROLE_USER` | Browse films and sessions, create and pay for reservations |
| `ROLE_ADMIN` | Everything above + manage films, sessions, rooms, and view the dashboard |

To promote a user to admin, update the role directly in the database:

```sql
UPDATE app_user
SET roleid = (SELECT id FROM role WHERE name = 'ROLE_ADMIN')
WHERE username = 'your_username';
```

---

## Known Limitations

- **No email confirmation** — reservations are confirmed immediately on checkout without sending an email.
- **In-memory rate limiting** — the login rate limiter resets on server restart and does not scale across multiple instances. For production, replace with a Redis-backed solution.
- **Single currency** — prices are stored and displayed in EUR with no multi-currency support.
- **No pagination** — all movies and sessions are fetched in a single request, which may be slow with large datasets.

---

## License

This project is licensed under the MIT License.
