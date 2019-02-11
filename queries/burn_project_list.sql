SELECT  burn_project_id,
        project_name AS 'name', 
        -- users.full_name AS 'submitted_by',
        project_acres,
        submitted_on
FROM burn_projects
-- JOIN users
-- ON users.user_id=burn_projects.submitted_by
ORDER BY submitted_on DESC;