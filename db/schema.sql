-- deletes old database with same name
DROP DATABASE IF EXISTS employees_db;
--creates new database
CREATE DATABASE employees_db;
--designates which database the tables are going into
USE employees_db;
---department table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
--roles table, had to be plural to work in debeaver, with connections (foreign key) to deparment table
CREATE TABLE roles  (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);
--employee table with connection to roles table
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  FOREIGN KEY (role_id)
  REFERENCES roles(id)
  FOREIGN KEY (manager_id)
  REFERENCES employee(id)
  ON DELETE CASCADE
);

