package com.movie.system.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "ShowTime")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data

public class ShowTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "show_date", nullable = false)
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "Movieid")
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "CinemaRoomid")
    private CinemaRoom cinemaRoom;

}
