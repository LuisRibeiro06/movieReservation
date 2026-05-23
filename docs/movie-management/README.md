# Use Case: Movie Management

This document details the process of listing, importing, and deleting movies by an administrator.

## 1. Requirements

- **FR08:** The system must allow an administrator to search for movies in an external source (OMDb API) by title.
- **FR09:** The system must allow an administrator to import a movie from the search results, saving its details (title, genre, duration, etc.) in the local database.
- **FR10:** The system must prevent the importation of duplicate movies by checking if a movie with the same `imdbId` already exists.
- **FR11:** The system must allow an administrator to list all imported movies.
- **FR12:** The system must allow an administrator to delete an existing movie.
- **FR13:** Only users with the `ROLE_ADMIN` permission can access these features.

## 2. Entities and Classes Involved

### Backend
- **Entities:**
  - `Movie`: Represents a movie in the system, with attributes such as `id`, `title`, `genre`, `duration`, `imdbId`, etc.
- **Controllers:**
  - `MovieController`: Exposes endpoints to manage movies (`/api/movies`), such as `GET /`, `POST /import`, `DELETE /{id}`, and `GET /search`.
- **Services:**
  - `MovieService`: Contains the business logic to search, import, and delete movies.
- **Clients (Feign):**
  - `MovieClient`: Feign client to communicate with the OMDb API (`http://www.omdbapi.com`).
- **DTOs:**
  - `OmdbSearchResult`: Models the search response from the OMDb API.
  - `OmdbMovieDetail`: Models the details of a movie obtained from the OMDb API.
- **Exceptions:**
  - `MovieNotFoundException`: Thrown when trying to delete a movie that does not exist.
  - `DuplicateMovieException`: Thrown when trying to import a movie that already exists in the database.

### Frontend
- **Pages:**
  - `AdminMovies.tsx`: Administration interface where the admin can search, import, and delete movies.
- **Services:**
  - `movieService.ts`: Functions to interact with the backend movie management endpoints.

## 3. Business Rules

1.  **Restricted Access:** All movie management operations (import, delete) require the user to have `ROLE_ADMIN`.
2.  **Movie Uniqueness:** The system does not allow the importation of a movie if a record with the same `imdbId` already exists. In these cases, a `DuplicateMovieException` must be thrown.
3.  **External Data Source:** Searching for new movies depends on the availability of the OMDb API. The API key (`omdb.api.key`) must be configured in `application.properties`.
4.  **Movie Deletion:** When deleting a movie, the system must first verify if it exists. If not, it throws a `MovieNotFoundException`. (Note: The current business logic does not prevent deleting a movie that has scheduled showtimes, which could be an improvement point).

## 4. Unit Tests

### Controller
- `testSearchMovie_WithValidTitle_ShouldReturnResults()`: Verifies if the OMDb API search returns a list of movies.
- `testImportMovie_Success()`: Tests the successful importation of a new movie.
- `testImportMovie_WhenMovieAlreadyExists_ShouldThrowDuplicateMovieException()`: Ensures that the duplicate movie exception is thrown correctly.
- `testDeleteMovie_Success()`: Verifies if a movie is successfully deleted.
- `testDeleteMovie_WhenMovieNotFound_ShouldThrowMovieNotFoundException()`: Tests if the exception is thrown when trying to delete a non-existent movie.
- `testAccessAdminMoviesPage_AsAdmin_ShouldSucceed()`: Integration test verifying if a user with `ROLE_ADMIN` can access the page.
- `testAccessAdminMoviesPage_AsUser_ShouldFail()`: Integration test ensuring that a user with `ROLE_USER` is blocked.

### Service
- `testSaveMovie_Success()`: Verifies if a new movie is successfully saved.
- `testSaveMovie_WhenMovieAlreadyExists_ShouldThrowDuplicateMovieException()`: Ensures that the duplicate movie exception is thrown correctly.
- `testDeleteMovie_Success()`: Verifies if a movie is successfully deleted.
- `testDeleteMovie_WhenMovieNotFound_ShouldThrowMovieNotFoundException()`: Tests if the exception is thrown when trying to delete a non-existent movie.