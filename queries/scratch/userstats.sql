SELECT full_name, count(full_name) FROM accomplishments a
JOIN users ON
a.added_by = users.user_id
GROUP BY full_name
ORDER BY count(full_name) DESC;

 