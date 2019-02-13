SELECT  burn_project_id,
        project_name, 
        users.full_name AS 'submitter',
        project_acres,
        submitted_on,
        agencies.agency AS 'agency',
        elevation_low,
        elevation_high,
        duration,
        major_fbps_fuel AS 'fuel_model',
        counties.name AS 'county'
FROM burn_projects
JOIN users 
ON users.user_id=burn_projects.submitted_by
JOIN agencies
ON agencies.agency_id=burn_projects.agency_id
JOIN counties
ON counties.county_id=burn_projects.county
WHERE burn_project_id=