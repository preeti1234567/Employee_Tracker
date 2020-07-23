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

let rolesMap = {};
let employeeMap = {};
let departmentMap = {};
function getDepartment() {
  employeeMap = {};
  connection.query("SELECT id, name FROM department order by name;", function (
    err,
    result
  ) {
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      departmentMap[result[i].name] = result[i].id;
    }
  });
}

function getEmployee() {
  employeeMap = {};
  connection.query(
    "SELECT id, CONCAT(first_name,' ' ,  last_name)  as name FROM employee order by name;",
    function (err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        employeeMap[result[i].name] = result[i].id;
      }
    }
  );
}

function getRole() {
  rolesMap = {};
  connection.query(
    "SELECT id,title FROM employee_role order by title;",
    function (err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        rolesMap[result[i].title] = result[i].id;
      }
    }
  );
}

function start() {
  getEmployee();
  getRole();
  getDepartment();
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
          "Update Employee Manager",
          "Add Role",
          "Remove Employee Role",
          "Add Department",
          "Remove Department",
          "Exit",
        ],
      },
    ])
    .then(function (answers) {
      switch (answers.options) {
        case "View All Employees": {
          viewAllEmployee();
          break;
        }
        case "View All Employees by department": {
          viewAllEmployeebyDepartment();
          break;
        }
        case "View All Employees by Manager": {
          viewAllEmployeebyManager();
          break;
        }
        case "Add Employee": {
          AddEmployee();
          break;
        }
        case "Remove Employee": {
          removeEmployee();
          break;
        }
        case "Remove Employee Role": {
          removeEmployeeRole();
          break;
        }
        case "Update Employee Manager": {
          updateEmployeeManager();
          break;
        }
        case "Add Role": {
          addRole();
          break;
        }
        case "Add Department": {
          ddDepartment();
          break;
        }
        case "Remove Department": {
          removeDepartment();
          break;
        }
        case "Exit":
        default:{
          connection.end();
          break;
        }
      }
    });
}

function viewAllEmployee() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, title, salary, name as department ,CONCAT(manager.first_name,' ' ,  manager.last_name)  as manager FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN department ON department.id = employee_role.department_id LEFT OUTER JOIN employee as manager ON manager.id = employee.manager_id order by employee.id;",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      start();
    }
  );
}

function viewAllEmployeebyDepartment() {
  connection.query(
    "SELECT name as department ,employee.id, employee.first_name, employee.last_name, title, salary,CONCAT(manager.first_name,' ' ,  manager.last_name)  as manager FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN department ON department.id = employee_role.department_id LEFT OUTER JOIN employee as manager ON manager.id = employee.manager_id order by name;",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      start();
    }
  );
}

function viewAllEmployeebyManager() {
  connection.query(
    "SELECT  CONCAT(manager.first_name,' ' ,  manager.last_name)   as manager,employee.id, employee.first_name, employee.last_name, title, salary,name as department  FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN department ON department.id = employee_role.department_id LEFT OUTER JOIN employee as manager ON manager.id = employee.manager_id order by manager;",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      start();
    }
  );
}

function AddEmployee() {
  const question = [
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
      choices: Object.keys(employeeMap),
    },
    {
      type: "list",
      name: "role",
      message: "what is the role",
      choices: Object.keys(rolesMap),
    },
  ];

  inquirer.prompt(question).then(function (answers) {
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: answers.firstName,
        last_name: answers.lastName,
        manager_id: employeeMap[answers.manager],
        role_id: rolesMap[answers.role],
      },
      function (err, res) {
        console.log(res.affectedRows + " employee inserted!\n");
      }
    );
    start();
  });
}

const validateNumber = (value) => {
  var number = /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/;
  if (value.match(number)) {
    return true;
  }
  return "invalid salary!";
};

function addRole() {
  const question = [
    {
      type: "input",
      name: "title",
      message: "What is the title of the role",
    },
    {
      type: "input",
      name: "salary",
      message: "what is the salary of this role",
      validate: validateNumber,
    },
    {
      type: "list",
      name: "department",
      message: "What is the department of this role",
      choices: Object.keys(departmentMap),
    },
  ];

  inquirer.prompt(question).then(function (answers) {
    connection.query(
      "INSERT INTO employee_role SET ?",
      {
        title: answers.title,
        salary: answers.salary,
        department_id: departmentMap[answers.department],
      },
      function (err, res) {
        console.log(res.affectedRows + " employee inserted!\n");
      }
    );
    start();
  });
}

function addDepartment() {
  const question = [
    {
      type: "input",
      name: "name",
      message: "What is department name",
    },
  ];

  inquirer.prompt(question).then(function (answers) {
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: answers.name,
      },
      function (err, res) {
        console.log(res.affectedRows + " department inserted!\n");
      }
    );
    start();
  });
}

function removeEmployee() {
  const question = [
    {
      type: "list",
      name: "employee",
      message: "Select Employee to remove",
      choices: Object.keys(employeeMap),
    },
  ];
  inquirer.prompt(question).then(function (answers) {
    connection.query(
      "Update employee set manager_id = null where ?",
      { manager_id: employeeMap[answers.employee] },
      function (err, res) {
        console.log(res.affectedRows + " employee deleted!\n");
      }
    );
    connection.query(
      "Delete From employee where ?",
      { id: employeeMap[answers.employee] },
      function (err, res) {
        console.log(res.affectedRows + " employee deleted!\n");
      }
    );
    start();
  });
}

function removeEmployeeRole() {
  const question = [
    {
      type: "list",
      name: "role",
      message: "Select role to remove",
      choices: Object.keys(rolesMap),
    },
  ];
  inquirer.prompt(question).then(function (answers) {
    connection.query(
      "Delete From employee_role where ?",
      { id: rolesMap[answers.role] },
      function (err, res) {
        console.log(res.affectedRows + " employee role deleted!\n");
      }
    );
    start();
  });
}

function removeDepartment() {
  const question = [
    {
      type: "list",
      name: "department",
      message: "Select department to remove",
      choices: Object.keys(departmentMap),
    },
  ];
  inquirer.prompt(question).then(function (answers) {
    connection.query(
      "Delete From department where ?",
      { id: departmentMap[answers.department] },
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " department deleted!\n");
      }
    );
    start();
  });
}

function updateEmployeeManager() {
  const question = [
    {
      type: "list",
      name: "employee",
      message: "Select Employee to update manager",
      choices: Object.keys(employeeMap),
    },
    {
      type: "list",
      name: "manager",
      message: "Select new manager",
      choices: Object.keys(employeeMap),
    },
  ];
  inquirer.prompt(question).then(function (answers) {
    connection.query(
      "Update employee set manager_id = " +
        employeeMap[answers.manager] +
        " where ?",
      { id: employeeMap[answers.employee] },
      function (err, res) {
        console.log(res.affectedRows + " employee deleted!\n");
      }
    );
    start();
  });
}
