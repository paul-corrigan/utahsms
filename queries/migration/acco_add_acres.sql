/* First clean up any zero values in accomplishments */
/* This may be needed depending on db .cnf settings, NO_ZERO_DATE enabled etc  */
UPDATE accomplishments SET start_datetime = '1970-01-01 08:00:00' 
WHERE CAST(start_datetime AS CHAR(20)) = '0000-00-00 00:00:00';
UPDATE accomplishments SET end_datetime = '1970-01-01 08:00:00' 
WHERE CAST(end_datetime AS CHAR(20)) = '0000-00-00 00:00:00';

/* Add target acres field */
ALTER TABLE accomplishments
ADD target_acres FLOAT;

/* For existing projects mirror black acres */
UPDATE accomplishments
SET target_acres = black_acres_change;
