package com.movie.system.model;


import lombok.*;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "Reservation")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_date", nullable = false)
    private LocalDateTime reservationDate = LocalDateTime.now();

    @Column(name = "price", nullable = false)
    private BigDecimal totalPrice;

    @ManyToOne
    @JoinColumn(name = "show_time_id", nullable = false)
    private ShowTime showTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private ReservationStatus status;

    @ManyToMany
    @JoinTable(
            name = "Reservation_Seat", // Nome da tabela de ligação no SQL
            joinColumns = @JoinColumn(name = "Reservationid"), // FK para esta classe
            inverseJoinColumns = @JoinColumn(name = "Seatid")  // FK para a classe Seat
    )
    private List<Seat> seats;

}
