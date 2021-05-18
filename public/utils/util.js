const { Choice } = require("./classes")

const createRoleChoicesArray = (data) => {
  return data.map((element) => new Choice(element.title, element.role_id));
};

const createManagerChoicesArray = (data) => {
  return data.map((element) => new Choice(element.name, element.employee_id));
};

module.exports = { createRoleChoicesArray, createManagerChoicesArray };
