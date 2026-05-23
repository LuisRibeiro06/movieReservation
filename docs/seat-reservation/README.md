# Use Case: Seat Reservation

This document details the process of a user selecting seats for a session and creating a reservation.

## 1. Requirements

- **FR23:** The system must allow a user to see the available seats for a given session.
- **FR24:** The system must allow a user to select one or more available seats.
- **FR25:** The system must prevent a user from selecting a seat that is already occupied or reserved.
- **FR26:** When creating a reservation, the system must calculate the total price based on the number of selected seats and the session price.
- **FR27:** The reservation must have an initial state of `PENDING` and an expiration time (e.g., 10 minutes).
- **FR28:** The system must allow a user to confirm the payment, changing the reservation status to `CONFIRMED`.
- **FR29:** If the payment is not confirmed within the time limit, the reservation must expire, and the seats must be released.
- **FR30:** A user must be able to see their reservation history.

## 2. Entities and Classes Involved

### Backend
- **Entities:**
  - `Reservation`: Represents a reservation made by a user.
  - `Seat`: Represents a seat.
  - `ShowTime`: Represents the session.
  - `User`: The user who makes the reservation.
- **Controllers:**
  - `ReservationController`: Exposes endpoints to create and manage reservations (`/api/reservations`).
  - `SeatController`: Exposes the endpoint to check seat availability (`/api/seats/availability`).
- **Services:**
  - `ReservationService`: Contains the business logic to create, confirm, and cancel reservations.
  - `SeatService`: Logic to get the status of the seats.
- **DTOs:**
  - `ReservationRequestDTO`: Models the input data to create a reservation.
  - `SeatAvailabilityDTO`: Models the information of a seat (available or not).
- **Exceptions:**
  - `SeatAlreadyReservedException`: Thrown if a selected seat is already occupied.
  - `ReservationNotFoundException`: Thrown if a reservation is not found.
  - `ReservationExpiredException`: Thrown if the time for payment expires.

### Frontend
- **Pages:**
  - `SessionPage.tsx`: Where the user sees and selects the seats.
  - `CartPage.tsx`: Where the user reviews their reservation and proceeds to payment.
  - `UserProfilePage.tsx`: Where the user can see their reservation history.
- **Services:**
  - `reservationService.ts`: Functions to create and manage reservations.
  - `seatService.ts`: Function to get seat availability.

## 3. Business Rules

1.  **Concurrency:** The system must ensure that two users cannot reserve the same seat at the same time. The `existsByShowTimeAndSeats` check in the `ReservationService` helps mitigate this.
2.  **Reservation Lifecycle:** A reservation follows the flow: `PENDING` -> `CONFIRMED` or `PENDING` -> `CANCELLED`/`EXPIRED`.
3.  **Automatic Expiration:** A scheduled task (`ScheduledTasks`) in the backend periodically checks `PENDING` reservations and releases the seats of those that have expired.
4.  **Authorization:** A user can only manage their own reservations.

## 4. Unit Tests

### Controller
- `testCreateReservation_Success()`: Verifies if a reservation is successfully created in the `PENDING` state.
- `testCreateReservation_WhenSeatIsAlreadyReserved_ShouldThrowSeatAlreadyReservedException()`: Ensures that the exception is thrown when trying to reserve an occupied seat.
- `testConfirmPayment_Success()`: Tests the confirmation of a reservation, which should change the status to `CONFIRMED`.
- `testConfirmPayment_WhenReservationIsExpired_ShouldThrowReservationExpiredException()`: Verifies if the expiration exception is thrown.
- `testGetOccupiedSeats_ShouldReturnCorrectSeats()`: Tests if the list of occupied seats for a session is correct.
- `testScheduledTask_ShouldReleaseExpiredReservations()`: Integration test for the scheduled task that releases seats from expired reservations.

### Service
- `testCreateReservation_Success()`: Verifies if a reservation is successfully created in the `PENDING` state.
- `testCreateReservation_WhenSeatIsAlreadyReserved_ShouldThrowSeatAlreadyReservedException()`: Ensures that the exception is thrown when trying to reserve an occupied seat.
- `testConfirmPayment_Success()`: Tests the confirmation of a reservation, which should change the status to `CONFIRMED`.
- `testConfirmPayment_WhenReservationNotFound_ShouldThrowException()`: Verifies if the exception is thrown when the reservation is not found.