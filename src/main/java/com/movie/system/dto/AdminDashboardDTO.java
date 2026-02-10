package com.movie.system.dto;

import com.movie.system.model.Reservation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private List<Reservation> allReservations;
    private long totalReservations;
    private BigDecimal totalRevenue;
}
