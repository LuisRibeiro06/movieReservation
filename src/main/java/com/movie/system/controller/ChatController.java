package com.movie.system.controller;

import com.movie.system.ai.tools.CinemaxAiTools;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {


    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder chatClientBuilder, CinemaxAiTools cinemaxAiTools) {
        this.chatClient = chatClientBuilder
                .defaultSystem("You are the CineBot, the virtual assistant super educated of the cinema Cinemax. Your mission is to help users find movies and sessions. Be concise and friendly. Always verify the sessions before responding.")
                .defaultTools(cinemaxAiTools)
                .build();
    }
    public record ChatRequest(String message) {}
    public record ChatResponse(String reply) {}

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String response = chatClient.prompt()
                .user(request.message())
                .call()
                .content();

        return new ChatResponse(response);
    }
}