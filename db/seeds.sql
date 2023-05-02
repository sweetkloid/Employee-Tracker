--making sure data is added to correct database
USE employees_db;

--adding data to department
INSERT INTO department (id, name)
VALUES 
(01, "Engineering"),
(02, "Finance"),
(03, "Sales"),
(04, "Legal");

--adding data to roles that corresponds with department table
INSERT INTO roles (id, title, salary, department_id)
VALUES
(01, "Sales Lead", 100000, 03),
(02, "Lead Engineer", 150000, 01),
(03, "Account Manager", 160000, 02),
(04," Leagal Team Lead", 250000, 04),
(05," Salesperson", 80000, 03),
(06, "Software Engineer", 120000, 01),
(07, "Accountant", 125000, 02),
(08, "Lawyer", 190000, 04);

--adding data that corresponds to role table and internal data
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(01, "John", "Smith", 01, null),
(02, "Samantha", "Baker", 02, null),
(03, "Sarrah", "Park", 03, null),
(04, "Tabitha", "Brown", 04, null),
(05, "David", "Rodriguez", 05, 01),
(06, "Lisa", "James", 06, 02),
(07, "Alex", "Charles", 07, 03),
(08, "James", "Neal", 08, 04)