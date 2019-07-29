SELECT  burn_project_id,
        project_name AS 'name',
        agency,
        -- users.full_name AS 'submitted_by',
        project_acres,
        first_burn,
        submitted_on
FROM burn_projects
JOIN agencies
ON agencies.agency_id = burn_projects.agency_id
ORDER BY submitted_on DESC
-- JOIN users
-- ON users.user_id=burn_projects.submitted_by