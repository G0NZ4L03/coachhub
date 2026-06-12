package com.coachhub.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DailyMetricRequest {
    private LocalDate date;
    private BigDecimal weight;
    private Integer steps;
    private BigDecimal sleepHours;
}