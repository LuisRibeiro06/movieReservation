# Use Case: Session Management

This document details the process of creating, editing, and deleting sessions (`ShowTime`) by an administrator.

## 1. Requirements

- **FR19:** The system must allow an administrator to create a new session, choosing a movie, a cinema room, the date/time, and the price.
- **FR20:** The system must allow an administrator to edit an existing session.
- **FR21:** The system must allow an administrator to delete a session.
- **FR22:** Only users with the `ROLE_ADMIN` permission can manage sessions.

## 2. Entities and Classes Involved

### Backend
- **Entities:**
  - `ShowTime`: Represents a scheduled cinema session.
- **Controllers:**
  - `ShowTimeController`: Exposes endpoints `/api/showtimes`.
- **Services:**
  - `ShowTimeService`: Business logic to manage sessions.
- **DTOs:**
  - `ShowTimeRequestDTO`: Input data for creating/editing a session.

### Frontend
- **Pages:**
  - `AdminSessions.tsx`: Administration interface to manage sessions.
- **Components:**
  - `SessionModal.tsx`: Modal to add or edit a session.
- **Services:**
  - `sessionService.ts`: Communication with the API.

## 3. Business Rules

1.  **Restricted Access:** Only admins can manage sessions.
2.  **Entity Validation:** When creating or editing a session, the system must validate if the associated movie and cinema room exist.
3.  **Exceptions:** The system throws `SessionNotFoundException` if it tries to edit or delete a non-existent session.

## 4. Unit Tests

### Controller

- `testCreateShowTime_Success()`: Validates the creation of a session.
- `testUpdateShowTime_Success()`: Verifies if the edition of a session works.
- `testDeleteShowTime_Success()`: Validates the deletion of a session.
- `testCreateShowTime_WhenMovieOrRoomNotFound_ShouldThrowException()`: Verifies the behavior when trying to associate a session with a non-existent movie or room.

### Service
- `testCreateShowTime_Success()`: Validates the creation of a session.
- `testCreateShowTime_WhenMovieOrRoomNotFound_ShouldThrowException()`: Verifies the behavior when trying to associate a session with a non-existent movie or room.
- `testUpdateShowTime_Success()`: Verifies if the edition of a session works.
- `testUpdateShowTime_WhenSessionNotFound_ShouldThrowException()`: Verifies the behavior when trying to edit a non-existent session.
- `testDeleteShowTime_Success()`: Validates the deletion of a session.