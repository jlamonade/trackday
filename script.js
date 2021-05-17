const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const {
  starterPrompt,
  addDepartmentPrompt,
  addRolePrompts,
} = require("./public/utils/inquirer_prompts");

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
  connection.query("SELECT department_id, name FROM department", (err, res) => {
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
          const departmentID = res[0].department_id
          const query = connection.query(
            "INSERT INTO role (title, department_id) VALUES (?, ?)",
            [role, departmentID],
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} rows updated.`)
            }
          );
          console.log(query.sql);
        }
      );
    });
  });
};

inquirer.prompt(starterPrompt).then(({ mainOptions }) => {
  switch (mainOptions) {
    case "Add Department":
      return createNewDepartment();
    case "Add Role":
      return createNewRole();
  }
});
