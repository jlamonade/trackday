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
  departmentMenuPrompts,
  roleMenuPrompts,
  employeeMenuPrompts,
  chooseDepartmentPrompt,
  chooseRolePrompt,
  chooseEmployeePrompt,
} = require("./public/utils/inquirer_prompts");
const {
  createRoleChoicesArray,
  createManagerChoicesArray,
  createDepartmentChoicesArray,
  createEmployeeChoiceArray,
} = require("./public/utils/util");

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
        viewDepartments();
      }
    );
  });
};
// TODO: update with choice constructor
const createNewRole = () => {
  connection.query("SELECT department_id, name FROM department", (err, res) => {
    if (err) throw err;
    const promptTemplate = addRolePrompts;
    promptTemplate[0].choices = createDepartmentChoicesArray(res);
    inquirer.prompt(promptTemplate).then((response) => {
      const query = connection.query(
        "INSERT INTO role (title, department_id, is_manager) VALUES (?, ?, ?)",
        [response.roleName, response.departmentId, response.isManager],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} rows updated.`);
          viewRoles();
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
      .then(({ employeeFirstName, employeeLastName, role, salary }) => {
        const query = connection.query(
          "INSERT INTO employee (first_name, last_name, role_id, salary) VALUES (?, ?, ?, ?)",
          [employeeFirstName, employeeLastName, role, salary],
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} rows updated.`);
            viewEmployees();
          }
        );
      });
  });
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.log(cTable.getTable(res));
    startingMenu();
  });
};

const viewRoles = () => {
  connection.query(
    "SELECT title, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.department_id",
    (err, res) => {
      if (err) throw err;
      console.log(cTable.getTable(res));
      startingMenu();
    }
  );
};

const viewEmployees = () => {
  connection.query(
    "SELECT CONCAT(e.first_name, ' ', e.last_name) AS name, role.title AS role, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager, e.salary FROM employee e JOIN role ON e.role_id = role.role_id JOIN department ON role.department_id = department.department_id LEFT JOIN employee m ON e.manager_id = m.employee_id;",
    (err, res) => {
      if (err) throw err;
      console.log(cTable.getTable(res));
      startingMenu();
    }
  );
};

const updateEmployee = () => {
  connection.query(
    "SELECT employee_id, CONCAT(first_name, ' ', last_name) AS name from employee",
    (err, res) => {
      if (err) throw err;
      const promptTemplate = updateEmployeePrompts;
      promptTemplate[0].choices = createEmployeeChoiceArray(res);
      inquirer.prompt(promptTemplate).then((response) => {
        const employeeId = response.employeeId;
        switch (response.employeeOption) {
          case "Update Role":
            return updateEmployeeRole(employeeId);
          case "Update Manager":
            return updateEmployeeManager(employeeId);
          case "Update Salary":
            return updateEmployeeSalary(employeeId);
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
          viewEmployees();
        }
      );
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
            viewEmployees();
          }
        );
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
        viewEmployees();
      }
    );
  });
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
            startingMenu();
          }
        );
      });
    }
  );
};

const deleteDepartment = () => {
  connection.query("SELECT department_id, name FROM department", (err, res) => {
    if (err) throw err;
    const promptTemplate = chooseDepartmentPrompt;
    chooseDepartmentPrompt.choices = createDepartmentChoicesArray(res);
    inquirer.prompt(promptTemplate).then((response) => {
      connection.query(
        "DELETE FROM department WHERE department_id = ?",
        [response.departmentId],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} rows updated`);
          viewDepartments();
        }
      );
    });
  });
};

const deleteRole = () => {
  connection.query("SELECT role_id, title FROM role", (err, res) => {
    if (err) throw err;
    const promptTemplate = chooseRolePrompt;
    promptTemplate.choices = createRoleChoicesArray(res);
    inquirer.prompt(promptTemplate).then((response) => {
      connection.query(
        "DELETE FROM role WHERE role_id = ?",
        [response.role],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} rows updated`);
          viewRoles();
        }
      );
    });
  });
};

const deleteEmployee = () => {
  connection.query(
    "SELECT employee_id, CONCAT(first_name, ' ', last_name) AS name from employee",
    (err, res) => {
      if (err) throw err;
      const promptTemplate = chooseEmployeePrompt;
      promptTemplate.choices = createEmployeeChoiceArray(res);
      inquirer.prompt(promptTemplate).then((response) => {
        connection.query(
          "DELETE FROM employee WHERE employee_id = ?",
          [response.employeeId],
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} rows updated`);
            viewEmployees();
          }
        );
      });
    }
  );
};

const departmentMenu = () => {
  inquirer.prompt(departmentMenuPrompts).then((response) => {
    switch (response.option) {
      case "View Departments":
        return viewDepartments();
      case "Add Departments":
        return createNewDepartment();
      case "Delete Department":
        return deleteDepartment(); // write function
    }
  });
};

const roleMenu = () => {
  inquirer.prompt(roleMenuPrompts).then((response) => {
    switch (response.option) {
      case "View Roles":
        return viewRoles();
      case "Add Role":
        return createNewRole();
      case "Delete Role":
        return deleteRole(); // write function
    }
  });
};

const employeeMenu = () => {
  inquirer.prompt(employeeMenuPrompts).then((response) => {
    switch (response.option) {
      case "View Employees":
        return viewEmployees();
      case "View Employees By Manager":
        return viewEmployeesByManager();
      case "Add Employee":
        return createNewEmployee();
      case "Update Employee":
        return updateEmployee(); // write function
      case "Delete Employee":
        return deleteEmployee(); // write function
    }
  });
};

const startingMenu = () => {
  inquirer.prompt(starterPrompt).then(({ mainOptions }) => {
    switch (mainOptions) {
      case "Departments":
        return departmentMenu();
      case "Roles":
        return roleMenu();
      case "Employees":
        return employeeMenu();
      case "Quit":
        return connection.end();
    }
  });
};

startingMenu();
