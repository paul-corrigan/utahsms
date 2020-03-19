select 
    distinct b.location,
    SUBSTR(b.location, 2,5) as "lat",
    SUBSTR(right(b.location, LOCATE(',', reverse(b.location)) - 1), 1,8) as "long",
/*     RIGHT(b.location,LOCATE(',',REVERSE(b.location))-1,4) as extracted, */
    request_acres, 
    elevation_low,
    agency,
    start_date
from burns b
join burn_projects p
on b.burn_project_id = p.burn_project_id
join agencies a
on p.agency_id = a.agency_id;