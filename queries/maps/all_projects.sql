SELECT 
project_name AS 'name',
agency,
lat,
lng
FROM burn_projects p
JOIN agencies a ON
a.agency_id = p.agency_id;