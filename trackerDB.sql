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
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Finance");



INSERT INTO role (title, salary, department_id)
VALUES ("Head of Sales", 120000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Head of Finance", 100000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Salesman", 60000,  1);

INSERT INTO role (title, salary, department_id)
VALUES ("Finance Analyst", 70000,  2);

INSERT INTO role (title, salary, department_id)
VALUES ("Finance Assistant", 55000,  2);





INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Herb", "Plant", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Paul", "Sampson", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ryan", "Conley", 4, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("George", "Erickson", 5, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mary", "Skaret", 3, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brent", "Drake", 3, 1);




