const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const {
  starterPrompt,
  addDepartmentPrompt,
  addRolePrompts,
  addEmployeePrompts,
  updateEmployeePrompts,
  updateEmployeeRolePrompt,
  chooseManagerPrompt,
  updateEmployeeSalaryPrompt,
} = require("./public/utils/inquirer_prompts");
const { Choice } = require("./public/utils/classes");

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
// TODO: update with choice constructor
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

const createNewEmployee = () => {
  connection.query("SELECT role_id, title FROM role", (err, res) => {
    if (err) throw err;
    const promptTemplate = addEmployeePrompts;
    promptTemplate[2].choices = createRoleChoicesArray(res);
    // console.log(choicesArray);
    inquirer
      .prompt(promptTemplate)
      .then(({ employeeFirstName, employeeLastName, role }) => {
        const query = connection.query(
          "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
          [employeeFirstName, employeeLastName, role],
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} rows updated.`);
          }
        );
        console.log(query.sql);
      });
  });
};
// TODO: mvoe this function to utils
const createRoleChoicesArray = (data) => {
  return data.map((element) => new Choice(element.title, element.role_id));
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
    "SELECT CONCAT(e.first_name, ' ', e.last_name) AS name, role.title AS role, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager, e.salary FROM employee e JOIN role ON e.role_id = role.role_id JOIN department ON role.department_id = department.department_id LEFT JOIN employee m ON e.manager_id = m.employee_id;",
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
        return new Choice(element.name, element.employee_id);
      });
      const promptTemplate = updateEmployeePrompts;
      promptTemplate[0].choices = choicesArray;
      inquirer.prompt(promptTemplate).then((response) => {
        const employeeId = response.employeeId;
        switch (response.employeeOption) {
          case "Update Role":
            return updateEmployeeRole(employeeId);
          case "Update Manager":
            return updateEmployeeManager(employeeId);
          case "Update Salary":
            return updateEmployeeSalary(employeeId); // TODO: write function
        }
      });
    }
  );
};

const updateEmployeeRole = (employeeId) => {
  connection.query("SELECT title, role_id FROM role", (err, res) => {
    if (err) throw err;
    const promptTemplate = updateEmployeeRolePrompt;
    promptTemplate.choices = createRoleChoicesArray(res);
    inquirer.prompt(promptTemplate).then((response) => {
      const roleId = response.newRole;
      const query = connection.query(
        "UPDATE employee SET ? WHERE employee_id = ?",
        [{ role_id: roleId }, employeeId],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} rows updated.`);
        }
      );
      console.log(query.sql);
    });
  });
};

const updateEmployeeManager = (employeeId) => {
  connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name, employee_id, role.is_manager FROM employee JOIN role ON role.role_id = employee.role_id WHERE role.is_manager = true;",
    (err, res) => {
      if (err) throw err;
      const promptTemplate = chooseManagerPrompt;
      promptTemplate.choices = createManagerChoicesArray(res);
      inquirer.prompt(promptTemplate).then((response) => {
        const roleId = response.manager;
        const query = connection.query(
          "UPDATE employee SET ? WHERE employee_id = ?",
          [{ manager_id: roleId }, employeeId],
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} rows updated.`);
          }
        );
        console.log(query.sql);
      });
    }
  );
};

const updateEmployeeSalary = (employeeId) => {
  inquirer.prompt(updateEmployeeSalaryPrompt).then((response) => {
    const salary = response.salary;
    const query = connection.query(
      "UPDATE employee SET ? WHERE employee_id = ?",
      [{ salary: salary }, employeeId],
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} rows updated.`);
      }
    );
    console.log(query.sql);
  });
};

// TODO: move to utils
const createManagerChoicesArray = (data) => {
  return data.map((element) => new Choice(element.name, element.employee_id));
};

const viewEmployeesByManager = () => {
  connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name, employee_id, role.is_manager FROM employee JOIN role ON role.role_id = employee.role_id WHERE role.is_manager = true",
    (err, res) => {
      if (err) throw err;
      const promptTemplate = chooseManagerPrompt;
      promptTemplate.choices = createManagerChoicesArray(res);
      inquirer.prompt(chooseManagerPrompt).then((response) => {
        const managerId = response.manager;
        const query = connection.query(
          "SELECT employee.employee_id, CONCAT(first_name, ' ', last_name) AS name, role.title FROM employee JOIN role ON employee.role_id = role.role_id WHERE employee.manager_id = ?",
          [managerId],
          (err, res) => {
            if (err) throw err;
            console.log(cTable.getTable(res));
          }
        );
        console.log(query.sql)
      });
    }
  );
};

const startingMenu = () => {
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
      case "View Employees By Manager":
        return viewEmployeesByManager();
      case "Update Employee":
        return updateEmployee();
      case "Quit":
        return connection.end();
    }
  });
}

startingMenu();