DROP DATABASE IF EXISTS trackerDB;

CREATE DATABASE trackerDB;

USE trackerDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,

  PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Web Development");

INSERT INTO department (name)
VALUES ("Customer Service");



INSERT INTO role (title, salary)
VALUES ("manager", 120000);

INSERT INTO role (title, salary, department_id)
VALUES ("engineer", 60000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Web Development Intern", 0,  2);

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Sevice Intern", 0,  1);





INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Herb", "Plant", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paul", "Heltemes", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ryan", "Heltemes", 3, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("George", "Clooney", 3, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mary", "Skaret", 4, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brent", "Drake", 4, 1);







-- SELECT name
-- FROM department RIGHT JOIN role ON department.id = role.department_id;

-- SELECT employee.id, first_name, last_name, title, salary, department.name
-- FROM employee 
-- RIGHT JOIN role ON role.id = employee.role_id
-- RIGHT JOIN department ON department.id = role.department_id