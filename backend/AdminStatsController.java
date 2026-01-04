package com.moneymap.admin.controller;

import com.moneymap.admin.dto.RegistrationStatsDTO;
import com.moneymap.admin.service.AdminStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/dashboard")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminStatsController {

    @Autowired
    private AdminStatsService adminStatsService;

    /**
     * Get user registration counts grouped by date
     * @param days Number of days to look back (default: 7)
     * @return List of registration stats with date and count
     */
    @GetMapping("/users-per-day")
    public ResponseEntity<List<RegistrationStatsDTO>> getUserRegistrations(
            @RequestParam(defaultValue = "7") int days) {
        try {
            List<RegistrationStatsDTO> stats = adminStatsService.getUserRegistrationsByDate(days);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}


