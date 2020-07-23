var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "employeesDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

let managersMap = {};
let rolesMap = {};

function getManager() {
  managersMap = {};
  connection.query(
    "SELECT manager.id, CONCAT(manager.first_name,' ' ,  manager.last_name)   as name FROM employee as manager inner join employee on manager.id = employee.manager_id ;",
    function (err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        managersMap[result[i].name] = result[i].id;
      }
    }
  );
}

function getRole() {
  rolesMap = {};
  connection.query("SELECT id,title FROM employee_role;", function (
    err,
    result
  ) {
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      rolesMap[result[i].title] = result[i].id;
    }
  });
}

function start() {
  getManager();
  getRole();
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do",
        choices: [
          "View All Employees",
          "View All Employees by department",
          "View All Employees by Manager",
          "Add Employee",
          "Remove Employee",
          "Remove Employee Role",
          "Update Employee Manager",
        ],
      },
    ])
    .then(function (answers) {
      switch (answers.options) {
        case "View All Employees": {
          viewAllEmployee();
          break;
        }
        case "View All Employees by department":
          viewAllEmployeebyDepartment();
          break;
        case "View All Employees by Manager":
          viewAllEmployeebyManager();
          break;
        case "Add Employee":
          AddEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Remove Employee Role":
          removeEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
      }
    });
}
function viewAllEmployee() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, title, salary, name as department ,CONCAT(manager.first_name,' ' ,  manager.last_name)  as manager FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN department ON department.id = employee_role.department_id LEFT OUTER JOIN employee as manager ON manager.id = employee.manager_id;",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      start();
    }
  );
}

function viewAllEmployeebyDepartment() {
  connection.query(
    "SELECT name as department ,employee.id, employee.first_name, employee.last_name, title, salary,CONCAT(manager.first_name,' ' ,  manager.last_name)  as manager FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN department ON department.id = employee_role.department_id LEFT OUTER JOIN employee as manager ON manager.id = employee.manager_id;",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      start();
    }
  );
}

function viewAllEmployeebyManager() {
  connection.query(
    "SELECT  CONCAT(manager.first_name,' ' ,  manager.last_name)   as manager,employee.id, employee.first_name, employee.last_name, title, salary,name as department  FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN department ON department.id = employee_role.department_id LEFT OUTER JOIN employee as manager ON manager.id = employee.manager_id;",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      start();
    }
  );
}

function AddEmployee() {
  const employeequestion = [
    {
      type: "input",
      name: "firstName",
      message: "What is the employee first name",
    },
    {
      type: "input",
      name: "lastName",
      message: "what is the employee last name",
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the manager",
      choices: Object.keys(managersMap),
    },
    {
      type: "list",
      name: "role",
      message: "what is the role",
      choices: Object.keys(rolesMap),
    },
  ];

  inquirer.prompt(employeequestion).then(function (answers) {
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: answers.firstName,
        last_name: answers.lastName,
        manager_id: managersMap[answers.manager],
        role_id: rolesMap[answers.role],
      },
      function (err, res) {
        console.log(res.affectedRows + " employee inserted!\n");
      }
    );
    start();
  });
}

function removeEmployee() {
  console.log("remove employee");
}

function removeEmployeeRole() {
  console.log("remove employeerole");
}

function updateEmployeeManager() {
  console.log("update employee manager");
}
