const starterPrompt = [
  {
    type: "list",
    name: "mainOptions",
    message: "What would you like to do?",
    choices: [
      "Add Department",
      "Add Role",
      "Add Employee",
      "View Departments",
      "View Roles",
      "View Employees",
      "Update Employee",
    ],
  },
];

const addDepartmentPrompt = [
  {
    type: "input",
    name: "departmentName",
    message: "What would like to name the department?"
  },
];

const addRolePrompts = [
  {
    type: "input",
    name: "roleName",
    message: "What would you like to name the role?"
  },
  {
    type: "list",
    name: "roleDepartment",
    message: "What department does this role belong to?"
  }
];

const addEmployeePrompts = [

]