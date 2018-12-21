SELECT  requests.burn_id,
        SUBSTRING(burns.project_name,1,20) AS 'name', 
        requests.submitted_on,
        request_acres
FROM requests
LEFT JOIN burns
ON requests.burn_project_id=burns.burn_project_id
ORDER BY request_acres DESC;