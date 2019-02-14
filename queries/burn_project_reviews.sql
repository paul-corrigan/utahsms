SELECT  users.full_name AS name,
        comment,
        added_on
FROM burn_project_reviews 
JOIN users 
ON users.user_id=burn_project_reviews.added_by
WHERE burn_project_id= ?