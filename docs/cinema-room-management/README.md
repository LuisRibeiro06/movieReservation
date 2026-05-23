# Use Case: Cinema Room Management

This document details the process of creating and deleting cinema rooms by an administrator.

## 1. Requirements

- **FR14:** The system must allow an administrator to create a new cinema room, specifying its name, number of rows, and number of seats per row.
- **FR15:** When creating a room, the system must automatically generate all corresponding seats (e.g., A1, A2, B1, B2...).
- **FR16:** The system must allow an administrator to delete an existing cinema room.
- **FR17:** The system must prevent the deletion of a cinema room if it has scheduled sessions (`ShowTime`).
- **FR18:** Only users with the `ROLE_ADMIN` permission can access these features.

## 2. Entities and Classes Involved

### Backend
- **Entities:**
  - `CinemaRoom`: Represents a cinema room, with `id`, `name`, and its total capacity.
  - `Seat`: Represents an individual seat within a room, with `id`, `seatRow`, `seatNumber`, and the reference to the `CinemaRoom`.
- **Controllers:**
  - `CinemaRoomController`: Exposes endpoints to manage rooms (`/api/cinema-rooms`), such as `GET /`, `POST /`, and `DELETE /{id}`.
- **Services:**
  - `CinemaRoomService`: Contains the business logic to create and delete rooms, including seat generation.
- **DTOs:**
  - `CreateCinemaRoomDTO`: Models the input data for creating a new room.
- **Exceptions:**
  - `CinemaRoomNotFound`: Thrown when trying to delete a room that does not exist.
  - `CinemaRoomIsNotEmptyException`: Thrown when trying to delete a room that still has scheduled sessions.

### Frontend
- **Pages:**
  - `AdminCinemaRooms.tsx`: Administration interface to create and delete cinema rooms.
- **Services:**
  - `cinemaRoomService.ts`: Functions to communicate with the backend cinema room management endpoints.

## 3. Business Rules

1.  **Restricted Access:** Creating and deleting cinema rooms are restricted operations to users with `ROLE_ADMIN`.
2.  **Seat Generation:** When a `CinemaRoom` is created, all its `Seat`s are created and associated with it. The relationship between `CinemaRoom` and `Seat` is of composition.
3.  **Cascade Deletion (Seats):** The relationship between `CinemaRoom` and `Seat` is configured with `cascade = CascadeType.ALL` and `orphanRemoval = true`. This means that when a `CinemaRoom` is deleted, all its `Seat`s are automatically removed from the database.
4.  **Deletion Restriction (Sessions):** The system prohibits the deletion of a `CinemaRoom` if there are `ShowTime`s associated with it. In these cases, the `CinemaRoomService` throws a `CinemaRoomIsNotEmptyException`, ensuring data integrity.

## 4. Unit Tests
### Controller
- `testCreateCinemaRoom_Success()`: Verifies if a room and all its seats are created correctly.
- `testDeleteCinemaRoom_Success()`: Tests the successful deletion of an empty room (without sessions).
- `testDeleteCinemaRoom_WhenRoomHasShowTimes_ShouldThrowCinemaRoomIsNotEmptyException()`: Ensures that the exception is thrown when trying to delete a room with scheduled sessions.
- `testDeleteCinemaRoom_WhenRoomNotFound_ShouldThrowCinemaRoomNotFoundException()`: Verifies if the exception is thrown when trying to delete a non-existent room.
- `testCascadeDelete_WhenCinemaRoomIsDeleted_SeatsShouldAlsoBeDeleted()`: Integration test confirming that the cascade deletion of seats is working.
### Service
- `testCreateCinemaRoomAndSeats_Success()`: Verifies if a room and all its seats are created correctly.
- `testDeleteCinemaRoom_WhenRoomHasShowTimes_ShouldThrowCinemaRoomIsNotEmptyException()`: Ensures that the exception is thrown when trying to delete a room with scheduled sessions.
- `testDeleteCinemaRoom_WhenRoomNotFound_ShouldThrowCinemaRoomNotFoundException()`: Verifies if the exception is thrown when trying to delete a non-existent room.
- `testDeleteCinemaRoom_Success()`: Tests the successful deletion of an empty room (without sessions).

