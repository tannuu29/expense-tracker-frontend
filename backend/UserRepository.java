package com.moneymap.user.repository;

import com.moneymap.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Count user registrations grouped by date
     * Groups by DATE(createdAt) and returns date and count
     * @param startDate Start date for filtering
     * @return List of Object arrays where [0] = date, [1] = count
     */
    @Query(value = 
        "SELECT DATE(created_at) as date, COUNT(*) as count " +
        "FROM users " +
        "WHERE DATE(created_at) >= :startDate " +
        "GROUP BY DATE(created_at) " +
        "ORDER BY DATE(created_at) ASC",
        nativeQuery = true)
    List<Object[]> countRegistrationsByDate(@Param("startDate") LocalDate startDate);
}


