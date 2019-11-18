UPDATE burn_projects 
SET project_acres=?,
    project_name=?,
    elevation_high=?,
    elevation_low=?,
    duration=?,
    agency_id=?,
    airshed_id=?,
    class_1=?,
    non_attainment=?,
    de_minimis=?,
    major_fbps_fuel=?,
    first_burn=?,
    ignition_method=?,
    county=?,
    burn_type=?,
    updated_on=?
WHERE burn_project_id=?