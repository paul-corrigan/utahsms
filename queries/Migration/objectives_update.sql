ALTER TABLE pre_burn_objectives
ADD COLUMN burn_project_id INT;


UPDATE pre_burn_objectives A
SET burn_project_id =
  (SELECT burn_project_id
   FROM pre_burns B
   WHERE B.pre_burn_id = A.pre_burn_id)
WHERE EXISTS
  (SELECT burn_project_id
   FROM pre_burns B
   WHERE B.pre_burn_id = A.pre_burn_id)   
