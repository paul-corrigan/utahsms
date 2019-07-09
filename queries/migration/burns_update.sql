/* First three updates needed to get this table back in action if running strict mode and or "NO ZERO DATE". see my.ini  */

UPDATE IGNORE burns
SET submitted_on = '1999-01-01 12:00:00'
WHERE submitted_on = '0000-00-00 00:00:00';

UPDATE IGNORE burns
SET start_date = '1999-01-01'
WHERE start_date = '0000-00-00';

UPDATE IGNORE burns
SET end_date = '1999-01-01'
WHERE end_date = '0000-00-00';

ALTER TABLE burns MODIFY submitted_on timestamp default '1999-01-01 12:00:00';
ALTER TABLE burns MODIFY pre_burn_id INT(11) NULL;
ALTER TABLE burns MODIFY added_by INT(11) NULL;
ALTER TABLE burns MODIFY district_id INT(11) NULL;
ALTER TABLE burns MODIFY agency_id INT(11) NULL;