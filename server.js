const mysql = require("mysql2");
const express = require("express");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL usernae,
    user: "root",
    // Your MySQL password
    password: "password",
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
    "SELECT Department.department_id, Department.department_name FROM Department";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startInquirer();
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
