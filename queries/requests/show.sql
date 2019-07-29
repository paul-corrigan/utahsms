/* REQUEST SHOW  */
SELECT  burn_id,
        burn_projects.project_name AS 'name', 
        users.full_name AS 'submitter',
        agencies.agency AS 'agency',
        burns.submitted_on AS 'submitted_on',        
        project_acres,
        request_acres,
        start_date,
        end_date,
        burns.added_on AS 'added_on',
/*         NEED MAP FUNCTIONALITY FOR THIS */
/*         burns.location AS 'location', */
        class_1,
        non_attainment,
        de_minimis,        
        counties.name AS 'county',
        burn_pile_types.name AS 'type',
        burn_statuses.name AS 'status'
FROM burns
JOIN burn_projects
ON burn_projects.burn_project_id=burns.burn_project_id
JOIN users 
ON users.user_id=burns.submitted_by
JOIN agencies
ON agencies.agency_id=burn_projects.agency_id
JOIN counties
ON counties.county_id=burn_projects.county
JOIN burn_pile_types
ON burn_pile_types.burn_pile_type_id=burn_projects.burn_type
JOIN burn_statuses
ON burns.status_id = burn_statuses.status_id
WHERE burn_id= ?