DROP DATABASE IF EXISTS trackday;

CREATE DATABASE trackday;

USE trackday;

CREATE TABLE department(
	department_id INTEGER AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE role(
	role_id INTEGER AUTO_INCREMENT,
    title VARCHAR(30),
    department_id INT,
    is_manager BOOLEAN,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee(
	employee_id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    salary INTEGER,
    role_id INT,
    manager_id INT,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);

-- SEEDS --
INSERT INTO department (department_id, name) 
VALUES (1, 'sales');
INSERT INTO department (department_id, name) 
VALUES (2, 'development');
INSERT INTO department (department_id, name) 
VALUES (3, 'designers');
INSERT INTO department (department_id, name)
VALUES (4, "test dept");

INSERT INTO role (role_id, title, department_id, is_manager) 
VALUES (1, 'sales manager', 1, true);
INSERT INTO role (role_id, title, department_id) 
VALUES (2, 'salesperson', 1);
INSERT INTO role (role_id, title, department_id) 
VALUES (3, 'lead engineer', 2);
INSERT INTO role (role_id, title, department_id, is_manager) 
VALUES (4, 'engineer', 2, true);
INSERT INTO role (role_id, title, department_id) 
VALUES (5, 'QA', 2);
INSERT INTO role (role_id, title, department_id, is_manager) 
VALUES (6, 'design manager', 3, true);
INSERT INTO role (role_id, title, department_id) 
VALUES (7, 'UX', 3);
INSERT INTO role (role_id, title, department_id) 
VALUES (8, 'UI', 3);

INSERT INTO employee (employee_id, first_name, last_name, role_id, salary) 
VALUES (1, "John", "K", 1, 200000);
INSERT INTO employee (employee_id, first_name, last_name, role_id, salary) 
VALUES (2, "Jason", "Lam", 3, 300000);
INSERT INTO employee (employee_id, first_name, last_name, role_id, salary) 
VALUES (3, "Jeremiah", "K", 6, 150000);
INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id, salary) 
VALUES (4, "Joey", "K", 4, 2, 70000);
INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id, salary) 
VALUES (5, "Joseph", "K", 5, 2, 100000);
INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id, salary) 
VALUES (6, "Jeff", "K", 2, 1, 35000);
INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id, salary) 
VALUES (7, "Joshua", "K", 7, 3, 89000);
INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id, salary) 
VALUES (8, "Jack", "L", 8, 3, 120000);