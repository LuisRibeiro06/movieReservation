package com.movie.system.service;

public class LoginRateLimiterService {
    private final int MAX_ATTEMPTS = 5;
    private final long BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

    private final java.util.Map<String, long[]> attempts = new java.util.concurrent.ConcurrentHashMap<>();

    public boolean isBlocked(String username) {
        long[] data = attempts.get(username);
        if (data == null) return false;

        long firstAttemptTime = data[0];
        int attemptCount = (int) data[1];

        if (attemptCount >= MAX_ATTEMPTS) {
            if (System.currentTimeMillis() - firstAttemptTime < BLOCK_DURATION_MS) {
                return true; // Still blocked
            } else {
                attempts.remove(username); // Unblock after duration
                return false;
            }
        }
        return false;
    }

    public void recordFailedAttempt(String username) {
        long[] data = attempts.get(username);
        if (data == null) {
            attempts.put(username, new long[]{System.currentTimeMillis(), 1});
        } else {
            data[1]++; // Increment attempt count
            attempts.put(username, data);
        }
    }

    public void resetAttempts(String username) {
        attempts.remove(username);
    }
}
