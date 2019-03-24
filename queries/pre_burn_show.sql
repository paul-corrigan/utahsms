SELECT  primary_ert_id,
        dispersion_model_id
FROM pre_burns 
WHERE burn_project_id=? 
ORDER BY pre_burn_id 
DESC LIMIT 1;