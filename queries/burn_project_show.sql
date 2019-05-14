SELECT  burn_project_id,
        project_name, 
        users.full_name AS 'submitter',
        project_acres,
        added_on,
        agencies.agency AS 'agency',
        elevation_low,
        elevation_high,
        airshed_id,
        class_1,
        non_attainment,
        de_minimis,
        duration,
        first_burn,
        burn_pile_types.name as 'type',
        ignition_methods.name as 'method',
        major_fbps_fuel AS 'fuel_model',
        counties.name AS 'county'
FROM burn_projects
JOIN users 
ON users.user_id=burn_projects.submitted_by
JOIN agencies
ON agencies.agency_id=burn_projects.agency_id
JOIN ignition_methods
ON ignition_methods.ignition_method_id=burn_projects.ignition_method
JOIN counties
ON counties.county_id=burn_projects.county
JOIN burn_pile_types
ON burn_pile_types.burn_pile_type_id=burn_projects.burn_type
WHERE burn_project_id= ?