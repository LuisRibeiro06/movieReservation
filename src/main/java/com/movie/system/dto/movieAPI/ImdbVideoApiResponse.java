package com.movie.system.dto.movieAPI;

import java.util.List;

public record ImdbVideoApiResponse(List<ImdbVideo> videos, int totalCount) {


    public record ImdbVideo(
        String id,
        String type,
        String name,
        String description
) {}
}


