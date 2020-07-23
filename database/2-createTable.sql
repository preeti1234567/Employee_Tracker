USE employeesDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE employee_role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE
  );
  
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL,
  manager_id INT NULL,
  FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE CASCADE,
  FOREIGN KEY (role_id)
        REFERENCES employee_role(id)
        ON DELETE CASCADE
  );




