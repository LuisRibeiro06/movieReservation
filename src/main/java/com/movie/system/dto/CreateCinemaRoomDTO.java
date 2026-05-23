package com.movie.system.dto;

public class CreateCinemaRoomDTO {
    private String name;
    private int numberOfRows;
    private int seatsPerRow;

    public CreateCinemaRoomDTO(String name, int numberOfRows, int seatsPerRow) {
        this.name = name;
        this.numberOfRows = numberOfRows;
        this.seatsPerRow = seatsPerRow;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getNumberOfRows() {
        return numberOfRows;
    }

    public void setNumberOfRows(int numberOfRows) {
        this.numberOfRows = numberOfRows;
    }

    public int getSeatsPerRow() {
        return seatsPerRow;
    }

    public void setSeatsPerRow(int seatsPerRow) {
        this.seatsPerRow = seatsPerRow;
    }
}
