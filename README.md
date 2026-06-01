# 🎬 Cinemax — Movie Reservation System

A full-stack movie reservation web application built with **Spring Boot** and **React**. Users can browse films, view sessions, select seats, and complete reservations. The system also features an **AI-powered ChatBot** to assist users with finding movies and showtimes.

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

### AI ChatBot (CineBot)
- **Conversational Assistance:** Ask the ChatBot for available movies and showtimes in natural language.
- **Tool-Based Functionality:** The AI uses a backend tool (`findSessions`) to fetch real-time data from the database, ensuring its answers are always up-to-date.
- **Powered by Google Gemini:** Utilizes the Gemini family of models via the Spring AI library for intelligent and context-aware responses.

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
| AI Integration | **Spring AI**, **Google Gemini** |
| Authentication | JWT (Auth0 java-jwt) |
| External API | OpenFeign → OMDB API |
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
│       ├── ai/                  # AI-related components (tools)
│       ├── model/               # JPA entities
│       └── ...
│
└── frontend/
    └── src/
        ├── components/          # Shared UI components (ChatWidget.tsx)
        └── ...
```

---

## Prerequisites

Make sure you have the following installed:

- **Java 21+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **PostgreSQL 14+** — [Download](https://www.postgresql.org/)
- An **OMDB API key** — [Get one free at omdbapi.com](https://www.omdbapi.com/apikey.aspx)
- A **Google AI API Key** — [Get one from Google AI Studio](https://aistudio.google.com/app/apikey)

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

# JWT
api.security.token.secret=your_super_secret_jwt_key_min_32_chars

# OMDB
omdb.api.key=your_omdb_api_key

# Google AI (Gemini)
spring.ai.google.genai.api-key=your_google_ai_api_key
spring.ai.google.genai.chat.model=gemini-2.5-flash
```

#### 4. Seed initial roles

Run this SQL once after the tables are created:

```sql
INSERT INTO role (name) VALUES ('ROLE_USER');
INSERT INTO role (name) VALUES ('ROLE_ADMIN');
```

#### 5. Run the backend

```bash
cd backend
mvn spring-boot:run
```

---

### Frontend (React)

#### 6. Install dependencies and run

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `spring.datasource.url` | `application.properties` | PostgreSQL connection string |
| `api.security.token.secret` | `application.properties` | JWT signing secret (min. 32 chars) |
| `omdb.api.key` | `application.properties` | OMDB API key for movie imports |
| `spring.ai.google.genai.api-key` | `application.properties` | Google AI API key for the ChatBot |

---

## API Overview

All endpoints are prefixed with `/api`.

### AI ChatBot

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/chat` | Public | Send a message to the CineBot |

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive a JWT |

... (rest of the API overview)

---

## Authentication

The API uses **stateless JWT authentication** via an `HttpOnly` cookie.

1. Register at `POST /api/auth/register`.
2. Login at `POST /api/auth/login`. The backend sets a secure, `HttpOnly` cookie named `token`.
3. All subsequent requests from the frontend automatically include this cookie.

Tokens expire after **24 hours**.

---
... (rest of the README)
```