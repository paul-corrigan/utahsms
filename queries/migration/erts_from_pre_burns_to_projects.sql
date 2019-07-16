select distinct project_name, primary_ert_id 
from pre_burns 
JOIN burn_projects 
ON pre_burns.burn_project_id=burn_projects.burn_project_id

UPDATE burn_projects A
SET ert =
  (SELECT burn_project_id
   FROM pre_burns B
   WHERE B.pre_burn_id = A.pre_burn_id)
WHERE EXISTS
  (SELECT burn_project_id
   FROM pre_burns B
   WHERE B.pre_burn_id = A.pre_burn_id)   