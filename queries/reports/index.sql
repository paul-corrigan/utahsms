/* EMISSION REPORT LIST */
SELECT accomplishment_id AS id,
AG.abbreviation AS agency,
D.identifier AS district,
SUBSTRING(B.project_name,1,30) AS name,
SUBSTRING(SUBSTRING_INDEX(A.location, ',', 1),2,6) AS lat,
SUBSTRING(SUBSTRING_INDEX(A.location, ',', -1),1,9) AS lon,
black_acres_change AS acres,
clearing_index,
start_datetime,
end_datetime,
S.name AS 'Status',
SUBSTRING_INDEX(state_comment, ',', 1) as comment
FROM accomplishments A
JOIN agencies AG
ON A.agency_id=AG.agency_id
JOIN districts D
ON A.district_id=D.district_id
JOIN burn_projects B
ON A.burn_project_id=B.burn_project_id
JOIN accomplishment_statuses S
ON A.status_id=S.status_id
ORDER BY id DESC