SELECT  burn_id,
        SUBSTRING(burn_projects.project_name,1,40) AS 'name',
        SUBSTRING(burns.submitted_on,1,10) AS 'date',
        request_acres
FROM burns
LEFT JOIN burn_projects
ON burns.burn_project_id=burn_projects.burn_project_id
ORDER BY date DESC;