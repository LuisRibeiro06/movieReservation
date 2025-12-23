package com.movie.system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(
        name = "Seat",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"roomId", "seatRow", "seatNumber"})
        }
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "seatRow", nullable = false)
    private String seatRow;

    @Column(name = "seatNumber", nullable = false)
    private Integer seatNumber;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roomId", nullable = false)
    private CinemaRoom room;
}