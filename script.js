const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { starterPrompt, addDepartmentPrompt } = require("./public/utils/inquirer_prompts");

// const connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "asdfjason",
//   database: "trackday",
// });

// const afterConnection = () => {
//   connection.query(
//     "SELECT * FROM employee LEFT JOIN role on employee.role_id = role.role_id;",
//     (err, res) => {
//       if (err) throw err;
//       console.log(res);
//       connection.end();
//     }
//   );
// };

// connection.connect((err) => {
//   if (err) throw err;
//   console.log(`connected as id ${connection.threadId}`);
// });

inquirer
  .prompt(starterPrompt)
  .then(({ mainOptions }) => {
    switch(mainOptions) {
      case "Add Department":
        inquirer.prompt()
    }
  });
