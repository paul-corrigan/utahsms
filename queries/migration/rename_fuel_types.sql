/* This changes the names of the fuel types to more understandable ones */
/*  */
UPDATE fuel_types
SET fuel_type = 'Timber (Grass and Understory)'
WHERE fuel_type_id = 2;

UPDATE fuel_types
SET fuel_type = 'Slash Piles / Dormant Brush'
WHERE fuel_type_id = 6;

UPDATE fuel_types
SET fuel_type = 'Compact Timber Litter'
WHERE fuel_type_id = 8;

UPDATE fuel_types
SET fuel_type = 'Timber (Understory)'
WHERE fuel_type_id = 10;

UPDATE fuel_types
SET fuel_type = 'Light Logging Slash'
WHERE fuel_type_id = 11;

UPDATE fuel_types
SET fuel_type = 'Medium Logging Slash'
WHERE fuel_type_id = 12;

UPDATE fuel_types
SET fuel_type = 'Heavy Logging Slash'
WHERE fuel_type_id = 13;