# CineBot - AI ChatBot Integration

This document provides a technical overview of the CineBot feature integrated into the Cinemax movie reservation system.

## Overview

The CineBot is an AI-powered assistant designed to help users find information about currently playing movies and available showtimes. It is built using the **Spring AI** framework and leverages Google's **Gemini** models for natural language understanding and generation.

The core of its capability lies in **Function Calling** (or Tool Calling). The AI model does not have direct access to the database; instead, it is provided with a description of a local Java method. When a user asks a relevant question, the AI requests the execution of this method. The backend executes the method, retrieves the data from the database, and feeds it back to the AI, which then constructs a natural language response.

## Architecture

The ChatBot feature spans both the frontend and backend:

### Frontend
- **Component:** `src/components/ChatWidget.tsx`
- **Description:** A floating chat interface available on all pages of the application.
- **Interaction:** It maintains a local state of the chat history and sends user messages via a `POST` request to the backend. It displays a "typing..." indicator while waiting for the AI's response.

### Backend
- **Controller:** `com.movie.system.controller.ChatController`
  - Exposes the `POST /api/chat` endpoint.
  - Initializes the `ChatClient` with a system prompt (defining the bot's persona) and registers the available tools.
- **Tools (Functions):** `com.movie.system.ai.tools.CinemaxAiTools`
  - Contains methods annotated with `@Tool`. These are the functions the AI can call.
  - Currently includes the `findSessions()` method, which fetches all upcoming showtimes via the `ShowTimeService` and formats them into a plain text string.
- **Service Integration:** `com.movie.system.service.ShowTimeService`
  - Provides the actual database querying logic to retrieve session data.

## Configuration

To enable the ChatBot, you must configure the Spring AI Google Gemini integration in your `application.properties`:

```properties
# Enable Spring AI Google Gemini starter
spring.ai.google.genai.api-key=your_google_api_key_here
spring.ai.google.genai.chat.model=gemini-2.5-flash Or any other model from the Gemini family
```

### Obtaining an API Key
You can obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Technical Details & Best Practices

### The `@Tool` Annotation
The `@Tool` annotation from Spring AI is crucial. The `description` parameter is passed to the AI model and serves as the prompt that dictates *when* the AI should trigger this tool.

```java
@Tool(description = "Procura por filmes e sessões de cinema disponíveis. Utiliza sempre esta função quando o utilizador perguntar por horários, filmes em exibição, ou sessões.")
public String findSessions() {
    // ...
}
```

### Robust Tool Design
During development, it was observed that complex arguments (like JSON-mapped Records) can sometimes cause the Gemini model integration to fail with parsing errors ( resulting in 500 Internal Server Errors). 

To maximize stability:
1.  **No Arguments:** The current `findSessions()` method is designed without arguments. This eliminates the need for the AI to construct JSON payloads, relying solely on the AI signaling the need to execute the function.
2.  **String Returns:** The tool returns a raw `String` instead of a complex object. This is universally supported and prevents serialization issues on the return trip to the AI model.
3.  **Error Handling:** The tool's execution is wrapped in a `try-catch` block. If a database error occurs, it returns an error string (e.g., "Ocorreu um erro interno...") rather than throwing an exception. This prevents the entire `/api/chat` endpoint from crashing and allows the AI to apologize to the user gracefully.

## Troubleshooting

- **500 Internal Server Error on `/api/chat`:** 
  - Ensure your Google API Key is valid and billing (if applicable) is active.
  - Check the backend console logs. If the error occurs during the tool execution, the `try-catch` in `CinemaxAiTools` will print the stack trace.
  - If the error occurs *before* the tool executes, it may be a JSON parsing error between Spring AI and Google's API, indicating an incompatibility with the specific model version.
- **AI doesn't know about movies:** Ensure the database is populated with movies and future showtimes. The AI only knows what the `findSessions()` tool returns.