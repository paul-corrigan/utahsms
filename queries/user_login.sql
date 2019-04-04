SELECT  user_id, 
        agency, 
        password,
        users.phone,
        email,
        active,
        full_name
FROM users
JOIN agencies 
ON users.agency_id = agencies.agency_id
WHERE email= ?