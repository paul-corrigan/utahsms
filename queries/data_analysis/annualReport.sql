/*Count of annual black acres by agency

select 
    YEAR(start_datetime) as Year,
    SUM(black_acres_change),
    agency
from accomplishments ac
join agencies a on ac.agency_id = a.agency_id
GROUP BY Year, agency 

*/


/*Count of annual burn days by agency */

select 
    YEAR(start_datetime) as Year,
    agency,
    COUNT(agency) as 'Burn Days'
from accomplishments ac
join agencies a on ac.agency_id = a.agency_id
GROUP BY Year, agency