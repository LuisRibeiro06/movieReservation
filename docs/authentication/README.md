# Use Case: User Authentication

This document details the process of user registration, login, and logout within the system.

## 1. Requirements

- **FR01:** The system must allow new users to register by providing a username, email, and password.
- **FR02:** The system must validate that the username and email are not already in use during registration.
- **FR03:** The system must allow existing users to log in using their username and password.
- **FR04:** The system must protect against brute-force attacks by limiting the number of failed login attempts from the same IP address.
- **FR05:** Authentication must be managed via a secure JWT (JSON Web Token), stored in an `HttpOnly` cookie to mitigate XSS attacks.
- **FR06:** The system must provide a logout endpoint to invalidate the user's session by clearing the authentication cookie.
- **FR07:** Newly registered users must be assigned the `ROLE_USER` permission by default.

## 2. Entities and Classes Involved

### Backend
- **Entities:**
  - `User`: Represents a user in the system, containing data such as `id`, `username`, `email`, `password`, and their `role`.
  - `Role`: Represents user permissions (e.g., `ROLE_USER`, `ROLE_ADMIN`).
- **Controllers:**
  - `AuthController`: Exposes the endpoints `/api/auth/login`, `/api/auth/register`, and `/api/auth/logout`.
- **Services:**
  - `TokenService`: Responsible for generating and validating JWT tokens.
  - `UserService`: Business logic related to the user.
  - `LoginRateLimiterService`: Controls login attempts to prevent brute-force attacks.
- **DTOs (Data Transfer Objects):**
  - `AuthRequestDTO`: Models the input data for login.
  - `RegisterDTO`: Models the input data for registration.
- **Security:**
  - `SecurityFilter`: Intercepts each request to validate the JWT token present in the cookie.

### Frontend
- **Pages:**
  - `LoginPage.tsx`: Login form.
  - `RegisterPage.tsx`: Registration form.
- **Hooks:**
  - `useAuth.tsx`: Central hook that manages the authentication state (whether the user is logged in, their data, etc.).
- **Services:**
  - `authService.ts`: Functions to communicate with the backend's authentication endpoints.
  - `api.ts`: Axios configuration, including `withCredentials: true` for sending cookies.

## 3. Business Rules

1.  **User Uniqueness:** Two users cannot have the same `username`. The system must throw a `UserAlreadyExistsException` if this rule is violated.
2.  **Role Assignment:** Upon registration, a new user is automatically assigned `ROLE_USER`.
3.  **Token Security:** The JWT token is generated with a secret key (`api.security.token.secret`) and has a defined expiration time.
4.  **Rate Limiting:** If an IP address exceeds the maximum number of failed login attempts, the system blocks further attempts for 15 minutes, throwing a `TooManyLoginAttemptsException`.
5.  **Session Management:** A successful login results in the creation of an `HttpOnly` cookie containing the token. Logout destroys this cookie by setting its `maxAge` to 0.

## 4. Unit Tests

- `testRegister_Success()`: Verifies if a user is created successfully and if `ROLE_USER` is assigned.
- `testRegister_WhenUsernameAlreadyExists_ShouldThrowException()`: Ensures that a `UserAlreadyExistsException` is thrown when trying to register a duplicate `username`.
- `testLogin_WithValidCredentials_ShouldReturnSuccessAndSetCookie()`: Verifies if login with valid credentials returns a success response and the `Set-Cookie` header.
- `testLogin_WithInvalidCredentials_ShouldThrowException()`: Ensures that an `InvalidCredentialsException` is thrown for incorrect credentials.
- `testLogin_WhenIpIsBlocked_ShouldThrowTooManyLoginAttemptsException()`: Tests if the IP blocking works after several failed attempts.
- `testLogout_ShouldReturnCookieWithMaxAgeZero()`: Verifies if the logout endpoint returns a `Set-Cookie` header that expires the token immediately.
