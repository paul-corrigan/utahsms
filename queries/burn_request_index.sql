SELECT  burns.burn_id,
        SUBSTRING(burn_projects.project_name,1,20) AS 'name', 
        burns.submitted_on,
        request_acres
FROM burns
LEFT JOIN burn_projects
ON burns.burn_project_id=burn_projects.burn_project_id
ORDER BY request_acres DESC;