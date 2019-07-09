ALTER TABLE agencies
ADD COLUMN display TINYINT(1) NOT NULL DEFAULT 1;
UPDATE agencies
SET display = 0
WHERE agency_id = 33;
UPDATE agencies
SET display = 0
WHERE agency_id = 1;
UPDATE agencies
SET agency = "US Forest Service"
WHERE agency_id = 3;
