const starterPrompt = [
  {
    type: "list",
    name: "mainOptions",
    message: "What would you like to do?",
    choices: ["Departments", "Roles", "Employees", "Quit"],
  },
];

const departmentMenuPrompts = {
  type: "list",
  name: "option",
  message: "What would you like to do?",
  choices: [
    "View Departments",
    "Add Department",
    "Update Department",
    "Delete Department",
  ],
};

const roleMenuPrompts = {
  type: "list",
  name: "option",
  message: "What would you like to do?",
  choices: ["View Roles", "Add Role", "Update Role", "Delete Role"],
};

const employeeMenuPrompts = {
  type: "list",
  name: "option",
  message: "What would you like to do?",
  choices: [
    "View Employees",
    "View Employees By Manager",
    "Add Employee",
    "Update Employee",
    "Delete Employee",
  ],
};

const addDepartmentPrompt = [
  {
    type: "input",
    name: "departmentName",
    message: "What would like to name the department?",
  },
];

const chooseDepartmentPrompt = {
  type: "list",
  name: "departmentId",
  message: "Choose department: ",
  choices: [
    // populated by function
  ],
};

const addRolePrompts = [
  chooseDepartmentPrompt,
  {
    type: "input",
    name: "roleName",
    message: "What would you like to name the role?",
  },
  {
    type: "confirm",
    name: "isManager",
    message: "Is this a manager role?",
  },
];

const chooseRolePrompt = {
  type: "list",
  name: "role",
  message: "Role?",
  choices: [
    // populated by function
  ],
}

const addEmployeePrompts = [
  {
    type: "input",
    name: "employeeFirstName",
    message: "First name?",
  },
  {
    type: "input",
    name: "employeeLastName",
    message: "Last name?",
  },
  chooseRolePrompt,
  {
    type: "number",
    name: "salary",
    message: "Salary?"
  }
];

const updateEmployeePrompts = [
  {
    type: "list",
    name: "employeeId",
    message: "Choose employee to update: ",
    choices: [],
  },
  {
    type: "list",
    name: "employeeOption",
    message: "What would you like to update?",
    choices: [
      "Update Role",
      "Update Manager",
      "Update Salary",
      // TODO: Add salary to schema
    ],
  },
];

const updateEmployeeRolePrompt = {
  type: "list",
  name: "newRole",
  message: "Choose a new role: ",
  choices: {
    // fill by function
  },
};

const chooseManagerPrompt = {
  type: "list",
  name: "manager",
  message: "Choose a manager: ",
  choices: [
    // fill by function
  ],
};



const updateEmployeeSalaryPrompt = {
  type: "number",
  name: "salary",
  message: "Enter new salary: ",
};

module.exports = {
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
};
