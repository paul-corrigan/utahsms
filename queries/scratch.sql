-- SELECT project_name, abbreviation, burns.location, request_acres
-- FROM burns
-- JOIN burn_projects
-- ON burn_projects.burn_project_id = burns.burn_project_id
-- JOIN agencies
-- ON agencies.agency_id = burns.agency_id


-- query to find distinct locations from burn requests, when multiple include those with largest acres
SELECT burn_projects.project_name, DISTINCT tt.location, agencies.abbreviation, tt.request_acres
FROM burns tt
INNER JOIN
    (SELECT burns.location, MAX(request_acres) AS MaxAcres
    FROM burns
    GROUP BY burns.location) groupedtt 
ON tt.location = groupedtt.location 
AND tt.request_acres = groupedtt.MaxAcres
JOIN burn_projects
ON burn_projects.burn_project_id = tt.burn_project_id
JOIN agencies
ON agencies.agency_id = tt.agency_id