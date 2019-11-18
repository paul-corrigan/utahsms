/* BURN REQUEST LIST  */
SELECT  burn_id,
        SUBSTRING(burn_projects.project_name,1,40) AS 'name',
        SUBSTRING(burns.start_date,1,10) AS 'start',
        SUBSTRING(burns.end_date,1,10) AS 'end',
        request_acres,
        start_date,
        burn_statuses.name AS status
FROM burns
LEFT JOIN burn_projects
ON burns.burn_project_id=burn_projects.burn_project_id
JOIN burn_statuses
ON burns.status_id=burn_statuses.status_id
ORDER BY start_date DESC;