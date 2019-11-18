SELECT 
  a.agency,
  project_name,
  LEFT(added_on, 4),
  LEFT(submitted_on, 4),
  LEFT(updated_on, 4)
FROM burn_projects b
JOIN agencies a ON 
a.agency_id=b.agency_id;
SELECT 
  a.agency,
  b.project_name,
  LEFT(p.added_on, 4),
  LEFT(p.submitted_on, 4),
  LEFT(p.updated_on, 4)
FROM pre_burns p
JOIN burn_projects b ON
p.burn_project_id = b.burn_project_id
JOIN agencies a ON 
a.agency_id=b.agency_id;
SELECT 
  a.agency,
  b.project_name,
  LEFT(p.added_on, 4),
  LEFT(p.submitted_on, 4),
  LEFT(p.updated_on, 4)
FROM burns p
JOIN burn_projects b ON
p.burn_project_id = b.burn_project_id
JOIN agencies a ON 
a.agency_id=b.agency_id;
SELECT 
  a.agency,
  b.project_name,
  LEFT(p.added_on, 4),
  LEFT(p.submitted_on, 4),
  LEFT(p.updated_on, 4)
FROM accomplishments p
JOIN burn_projects b ON
p.burn_project_id = b.burn_project_id
JOIN agencies a ON 
a.agency_id=b.agency_id;