USE employeesDB;

INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Marketing');
INSERT INTO department (name) VALUES ('IT');
INSERT INTO department (name) VALUES ('Humar Resource');

INSERT INTO employee_role (title,salary,department_id) VALUES ('Sales Manager',2000.00,1);
INSERT INTO employee_role (title,salary,department_id) VALUES ('Sales Lead',1000.00,1);
INSERT INTO employee_role (title,salary,department_id) VALUES ('Marketing Manager',2000.00,2);
INSERT INTO employee_role (title,salary,department_id) VALUES ('Marketing Lead',1000.00,2);
INSERT INTO employee_role (title,salary,department_id) VALUES ('IT Manager',2000.00,3);
INSERT INTO employee_role (title,salary,department_id) VALUES ('IT Lead',1000.00,3);
INSERT INTO employee_role (title,salary,department_id) VALUES ('Humar Resource Manager',2000.00,4);


INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Preeti','Gupta',5,null);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Prakhar','Gupta',6,1);