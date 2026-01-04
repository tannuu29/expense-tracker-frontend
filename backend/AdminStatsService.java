package com.moneymap.admin.service;

import com.moneymap.admin.dto.RegistrationStatsDTO;
import com.moneymap.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminStatsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get user registration counts grouped by date for the last N days
     * @param days Number of days to look back
     * @return List of registration stats
     */
    public List<RegistrationStatsDTO> getUserRegistrationsByDate(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        
        // Get registration counts grouped by date from repository
        List<Object[]> results = userRepository.countRegistrationsByDate(startDate);
        
        // Convert to DTOs
        return results.stream()
                .map(result -> {
                    LocalDate date = (LocalDate) result[0];
                    Long count = ((Number) result[1]).longValue();
                    return new RegistrationStatsDTO(date, count);
                })
                .collect(Collectors.toList());
    }
}


