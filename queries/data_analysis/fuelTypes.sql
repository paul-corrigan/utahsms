select 
    fuel_type,    
    COUNT(fuel_type) AS numproj
from burn_projects b
join fuel_types f
on b.major_fbps_fuel = f.fuel_type_id
group by fuel_type
order by numproj;
