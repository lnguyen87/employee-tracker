const mysql = require("mysql2");
const express = require("express");
const inquirer = require("inquirer");
// const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "Nguyen*1",
    database: "employee_tracker",
  },
  console.log("Connected to the employee tracker database.")
);

// runs inquirer
db.connect(function (err) {
  if (err) throw err;
  startInquirer();
});

function startInquirer() {
  inquirer
    .prompt({
      type: "list",
      name: "start",
      message: "Please select from the following options.",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    })
    .then(function (choice) {
      switch (choice.start) {
        case "View all departments":
          viewDepartment();
          break;

        case "View all roles":
          viewRole();
          break;

        case "View all employees":
          viewEmployee();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Update an employee role":
          updateEmployee();
          break;
      }
    });
}

// view all departments
function viewDepartment() {
  let query =
    "SELECT department.department_id, department.department_name FROM department";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startInquirer();
  });
}

// view all roles
function viewRole() {
  let query =
    "SELECT role.role_id, role.title, role.salary, role.department_id FROM role";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startInquirer();
  });
}

// view all employees
function viewEmployee() {
  let query =
    "SELECT employee.employee_id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startInquirer();
  });
}

// create new department
function addDepartment() {
  let query = "SELECT * FROM department";
  db.query(query, function (err, res) {
    if (err) throw err;
    inquirer
      .prompt({
        type: "input",
        name: "addDept",
        message: "What is the name of the new department?",
        validate: (deptInput) => {
          if (deptInput) {
            return true;
          } else {
            console.log("Please enter a department name!");
            return false;
          }
        },
      })
      .then((res) => {
        db.query(
          `INSERT INTO department (department_name)
          VALUES ('${res.addDept}')`,
          (err, data) => {
            if (err) {
              throw err;
            }
            console.log("Department has been added.");
            viewDepartment();
          }
        );
      });
  });
}

// create new role
function addRole() {
  let query = "SELECT * FROM role";
  // let deptQuery = "SELECT * FROM department";
  db.query(query, function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "addTitle",
          message: "What is the title of the new role?",
          validate: (titleInput) => {
            if (titleInput) {
              return true;
            } else {
              console.log("Please enter a role title!");
              return false;
            }
          },
        },
        {
          type: "number",
          name: "addSalary",
          message: "What is the salary for the new role?",
          validate: (salaryInput) => {
            if (salaryInput) {
              return true;
            } else {
              console.log("Please enter a salary for the new role!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "addId",
          message: "Please enter the department ID for this role.",
          validate: (idInput) => {
            if (idInput) {
              return true;
            } else {
              console.log(
                "Please enter a department ID associated to this role!"
              );
              return false;
            }
          },
        },
      ])
      .then((res) => {
        db.query(
          `INSERT INTO role (title, salary, department_id)
          VALUES ('${res.addTitle}', '${res.addSalary}', '${res.addId}')`,
          (err, data) => {
            if (err) {
              throw err;
            }
            console.log("A new role has been added.");
            viewRole();
          }
        );
      });
  });
}

// GET all departments
app.get("/api/department", (req, res) => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// GET all roles
app.get("/api/role", (req, res) => {
  const sql = `SELECT * FROM role`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// GET a single employee
app.get("/api/employee/:id", (req, res) => {
  const sql = `SELECT * FROM employee WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

// GET all employees
app.get("/api/employee", (req, res) => {
  const sql = `SELECT * FROM employee`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
