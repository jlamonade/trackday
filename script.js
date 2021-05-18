const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const {
  starterPrompt,
  addDepartmentPrompt,
  addRolePrompts,
  addEmployeePrompts,
  updateEmployeePrompts,
} = require("./public/utils/inquirer_prompts");
const Choice = require("./public/utils/classes");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "asdfjason",
  database: "trackday",
});

const createNewDepartment = () => {
  inquirer.prompt(addDepartmentPrompt).then((response) => {
    console.log(response);
    const departmentName = response.departmentName;
    const query = connection.query(
      "INSERT INTO department (name) VALUES (?)",
      [departmentName],
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} rows changed.`);
      }
    );
    console.log(query.sql);
  });
};

const createNewRole = () => {
  connection.query("SELECT name FROM department", (err, res) => {
    if (err) throw err;
    // const departmentArray = res.map((element) => [
    //   element.department_id,
    //   `${element.name}`,
    // ]);
    const nameArray = res.map((element) => element.name);
    const promptTemplate = addRolePrompts;
    promptTemplate[0].choices = nameArray;
    inquirer.prompt(promptTemplate).then(({ department, roleName }) => {
      const role = roleName;
      connection.query(
        "SELECT department_id FROM department WHERE name = ?",
        [department],
        (err, res) => {
          if (err) throw err;
          const departmentID = res[0].department_id;
          const query = connection.query(
            "INSERT INTO role (title, department_id) VALUES (?, ?)",
            [role, departmentID],
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} rows updated.`);
            }
          );
          console.log(query.sql);
        }
      );
    });
  });
};
// TODO: create object array for choices for the prompts in this function
const createNewEmployee = () => {
  connection.query("SELECT title FROM role", (err, res) => {
    if (err) throw err;
    const titleArray = res.map((element) => element.title);
    const promptTemplate = addEmployeePrompts;
    promptTemplate[2].choices = titleArray;
    inquirer
      .prompt(promptTemplate)
      .then(({ employeeFirstName, employeeLastName, role }) => {
        connection.query(
          "SELECT role_id FROM role WHERE title = ?",
          [role],
          (err, res) => {
            if (err) throw err;
            const query = connection.query(
              "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
              [employeeFirstName, employeeLastName, res[0].role_id],
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} rows updated.`);
              }
            );
            console.log(query.sql);
          }
        );
      });
  });
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.log(cTable.getTable(res));
  });
};

const viewRoles = () => {
  connection.query(
    "SELECT title, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.department_id",
    (err, res) => {
      if (err) throw err;
      console.log(cTable.getTable(res));
    }
  );
};

const viewEmployees = () => {
  connection.query(
    "SELECT CONCAT(e.first_name, ' ', e.last_name) AS name, role.title AS role, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e JOIN role ON e.role_id = role.role_id JOIN department ON role.department_id = department.department_id LEFT JOIN employee m ON e.manager_id = m.employee_id;",
    (err, res) => {
      if (err) throw err;
      console.log(cTable.getTable(res));
    }
  );
};

const updateEmployee = () => {
  connection.query(
    "SELECT employee_id, CONCAT(first_name, ' ', last_name) AS name from employee",
    (err, res) => {
      if (err) throw err;
      // console.log(cTable.getTable(res));
      const choicesArray = res.map((element) => {
        return new Choice(element.name, element.employee_id)
      })
      const promptTemplate = updateEmployeePrompts;
      promptTemplate[0].choices = choicesArray;
      inquirer.prompt(promptTemplate).then((response) => {
        console.log(response);
      });
    }
  );
};

inquirer.prompt(starterPrompt).then(({ mainOptions }) => {
  switch (mainOptions) {
    case "Add Department":
      return createNewDepartment();
    case "Add Role":
      return createNewRole();
    case "Add Employee":
      return createNewEmployee();
    case "View Departments":
      return viewDepartments();
    case "View Roles":
      return viewRoles();
    case "View Employees":
      return viewEmployees();
    case "Update Employee":
      return updateEmployee();
  }
});
