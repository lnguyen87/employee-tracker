INSERT INTO department (department_name)
VALUES
    ('Operations'),
    ('Engineering'),
    ('Production'),
    ('Maintenance');

INSERT INTO role (title, salary, department_id)
VALUES    
    ('Ops', 100000, 1),
    ('Eng', 90000, 2),
    ('Prod', 55000, 3),
    ('Maint', 45000, 4);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Ronald', 'Firbank', 1, NULL),
    (2, 'Virginia', 'Woolf', 2, 1),
    (3, 'Piers', 'Gaveston', 3, 2),
    (4, 'Charles', 'LeRoi', 4, 2),
    (5, 'Katherine', 'Mansfield', 2, 1),
    (6, 'Dora', 'Carrington', 4, 2),
    (7, 'Edward', 'Bellamy', 3, 2),
    (8, 'Montague', 'Summers', 1, NULL),
    (9, 'Octavia', 'Butler', 3, 2),
    (10, 'Unica', 'Zurn', 3, 2);