SELECT  burn_project_id,
        project_name AS 'name', 
        users.full_name AS 'submitted_by',
        project_acres
FROM burns
JOIN users
ON users.user_id=burns.submitted_by
ORDER BY project_acres DESC;