# Backend Integration Guide

## Admin Activity Chart - Backend Implementation

This directory contains the backend code for the Admin Activity Chart feature.

## Files to Add to Your Spring Boot Project

1. **AdminStatsController.java** - REST controller for admin statistics
   - Location: `src/main/java/com/moneymap/admin/controller/AdminStatsController.java`
   - Endpoint: `GET /admin/dashboard/users-per-day?days=7`
   - Secured with `@PreAuthorize("hasRole('ROLE_ADMIN')")`

2. **RegistrationStatsDTO.java** - Data Transfer Object
   - Location: `src/main/java/com/moneymap/admin/dto/RegistrationStatsDTO.java`
   - Contains: `date` (LocalDate) and `count` (Long)

3. **AdminStatsService.java** - Service layer
   - Location: `src/main/java/com/moneymap/admin/service/AdminStatsService.java`
   - Business logic for fetching registration statistics

4. **UserRepository.java** - Repository method
   - Add the `countRegistrationsByDate` method to your existing UserRepository
   - Uses native SQL query with `GROUP BY DATE(created_at)`

## Database Schema Requirements

The query assumes your `users` table has:
- `created_at` column (DATETIME or TIMESTAMP)
- Column name might need adjustment based on your schema

## SQL Query Details

The repository uses a native query:
```sql
SELECT DATE(created_at) as date, COUNT(*) as count 
FROM users 
WHERE DATE(created_at) >= :startDate 
GROUP BY DATE(created_at) 
ORDER BY DATE(created_at) ASC
```

## Adjustments Needed

1. **Package Names**: Update package names to match your project structure
2. **User Entity**: Ensure your User entity has `createdAt` field
3. **Column Names**: Adjust `created_at` if your database uses different naming (e.g., camelCase)
4. **Security**: Ensure your security configuration allows `ROLE_ADMIN` access
5. **Date Format**: The API returns LocalDate which will be serialized as ISO date string (YYYY-MM-DD)

## Response Format

The API returns JSON array:
```json
[
  { "date": "2025-01-01", "count": 5 },
  { "date": "2025-01-02", "count": 3 },
  ...
]
```

## Testing

Test the endpoint:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:80/admin/dashboard/users-per-day?days=7
```


