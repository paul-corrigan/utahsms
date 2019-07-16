SELECT accomplishment_id AS id,
AG.abbreviation AS Agency,
D.identifier AS DISTRICT,
SUBSTRING(B.project_name,1,20) AS Name,
SUBSTRING(SUBSTRING_INDEX(A.location, ',', 1),2,6) AS Lat,
SUBSTRING(SUBSTRING_INDEX(A.location, ',', -1),1,9) AS Lon,
black_acres_change AS Acres,
clearing_index,
start_datetime,
end_datetime,
S.name AS 'Status',
SUBSTRING_INDEX(state_comment, ',', 1) as Comment
FROM accomplishments A
JOIN agencies AG
ON A.agency_id=AG.agency_id
JOIN districts D
ON A.district_id=D.district_id
JOIN burn_projects B
ON A.burn_project_id=B.burn_project_id
JOIN accomplishment_statuses S
ON A.status_id=S.status_id
ORDER BY start_datetime