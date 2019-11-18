CREATE TABLE ventnames (
  vent_id TINYINT PRIMARY KEY,
  name VARCHAR(20)
);
INSERT INTO ventnames
  (vent_id, name)
VALUES 
(1,'Poor'),
(2,'Fair'),
(3,'Good'),
(4,'Excellent');