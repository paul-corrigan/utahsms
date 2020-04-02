/* Location is stored as a text field with format (lat,long) in the original db */
/* This query breaks the column into two, removes comma and parenthesis, retaining only the numbers */
/* 
SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(location,',',1),'(',-1) AS 'Lat',
       SUBSTRING_INDEX(SUBSTRING_INDEX(location,',',-1),')',1) AS 'Long'
        
FROM burn_projects; */

/* Write a query to add these values to the burn_projects table,
Then do the same with burn_requests */

ALTER TABLE burn_projects ADD lat FLOAT;

ALTER TABLE burn_projects ADD lng FLOAT;

UPDATE burn_projects SET lng = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(location,',',-1),')',1));

UPDATE burn_projects SET lat = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(location,',',1),'(',-1));
