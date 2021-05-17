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
    type: "list",
    name: "department",
    message: "Choose department: ",
    choices: [
      // populated by function
    ]
  },
  {
    type: "input",
    name: "roleName",
    message: "What would you like to name the role?"
  },
];

const addEmployeePrompts = [
  {
    type: "input",
    name: "employeeFirstName",
    message: "First name?"
  },
  {
    type: "input",
    name: "employeeLastName",
    message: "Last name?"
  },
  {
    type: "list",
    name: "role",
    message: "Role?",
    choices: [
      // populated by function
    ],
  }
]

module.exports = { starterPrompt, addDepartmentPrompt, addRolePrompts, addEmployeePrompts }