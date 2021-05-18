const { Choice } = require("./classes");

const createDepartmentChoicesArray = (data) => {
  return data.map((element) => new Choice(element.name, element.department_id));
};

const createRoleChoicesArray = (data) => {
  return data.map((element) => new Choice(element.title, element.role_id));
};

const createManagerChoicesArray = (data) => {
  return data.map((element) => new Choice(element.name, element.employee_id));
};

const createEmployeeChoiceArray = (data) => {
  return data.map((element) => {
    return new Choice(element.name, element.employee_id);
  });
};

module.exports = {
  createRoleChoicesArray,
  createManagerChoicesArray,
  createDepartmentChoicesArray,
  createEmployeeChoiceArray,
};
