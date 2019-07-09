ALTER TABLE burn_projects
ADD COLUMN pm_max INT;

ALTER TABLE burn_projects
MODIFY agency_id INT(11) NULL;