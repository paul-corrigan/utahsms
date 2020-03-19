select 
    project_name,
    year,
    acres,
    agency,
    district,
    full_name
from pre_burns p

join agencies a on p.agency_id = a.agency_id
join districts d on d.district_id = p.district_id
join users u
on u.user_id = p.added_by
join burn_projects b
on b.burn_project_id = p.burn_project_id
where year = 2020 and p.status_id = 4
/* order by project_name */
/* select 
    YEAR(start_datetime) as Year,
    SUM(black_acres_change)
FROM accomplishments
GROUP BY Year */