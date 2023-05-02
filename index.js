// Packages needed for this application
const inquirer = require('inquirer');
const connection = require('./server');
const fs = require('fs');

// Read the query from the SQL file
const query = fs.readFileSync('../Employee-Tracker/db/query.sql', 'utf8');

// The input array that node will use in the terminal
function init() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'Please select what what you would like to do.',
      name: 'todo',
      choices: ["View All Employees", "Add Employee", "Delete an Employee", "Update Employee Role", "View Employees by Manager", "Update Employee by Manager", "View Employee by Department", "View All Roles", "Add Role", "View All Departments", "Add Department", "Delete a Department", "Quit"]
    },

  ]).then(async (answers) => {
    if (answers.todo === 'View All Employees') {
      connection.query('SELECT * FROM employee', (error, results) => {
        if (error) throw error;
        console.table(results);
        init();
      });
    } else if (answers.todo === 'Add Employee') {
      const employeeInfo = await inquirer.prompt([
        {
          type: 'input',
          message: "Enter employee's first name:",
          name: 'first_name',
        },
        {
          type: 'input',
          message: "Enter employee's last name:",
          name: 'last_name',
        },
        {
          type: 'input',
          message: "Enter employee's role ID:",
          name: 'role_id',
        },
        {
          type: 'input',
          message: "Enter employee's manager ID (if applicable):",
          name: 'manager_id',
        },
      ]);
      const query = 'INSERT INTO employee SET ?';
      connection.query(query, employeeInfo, (error, results) => {
        if (error) throw error;
        console.log('New employee added successfully!');
        init();

      });
    } else if (answers.todo === 'Delete an Employee'){
      connection.query('SELECT * FROM employee', (error, results) => { 
        if (error) throw error;
        const choices = results.map(result =>({name:result.name, value:result.})); 
        inquirer.prompt ([
          {
            type: 'list',
            message: "an employee to delete.",
            name: 'employee',
            choices: choices
          },
          {
            type: 'confirm',
            message: "Are you sure you want to delete this employee?",
            name: 'confirm',
            default: false
          }
        ]) .then(deleteInfo => {
          if (deleteInfo.confirm){
            const employeeId = deleteInfo.employee;
            const query = 'DELETE FROM employee WHERE id = ?';
            connection.query (query, employeeId, (error, results) => {
              if (error) throw error;
              console.log('Employee deleted successfully!');
            });
          } else {
            console.log('Deletion cancelled.');
          }
        });
      });
    }
    else if (answers.todo === 'Update Employee Role') {
      // Get a list of employees to choose from
      connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (error, results) => {
        if (error) throw error;

        // Prompt the user to select an employee from the list
        inquirer.prompt({
          type: 'list',
          name: 'employee',
          message: 'Select an employee:',
          choices: results.map(result => ({ name: result.name, value: result.id }))
        }).then(employeeInfo => {
          // Get a list of roles to choose from
          connection.query('SELECT id, title FROM roles', (error, results) => {
            if (error) throw error;

            // Prompt the user to select a new role from the list
            inquirer.prompt({
              type: 'list',
              name: 'role',
              message: 'Select a new role:',
              choices: results.map(result => ({ name: result.title, value: result.id }))
            }).then(roleInfo => {
              // Update the employee's role in the database
              const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
              const values = [roleInfo.role, employeeInfo.employee];
              connection.query(query, values, (error, results) => {
                if (error) throw error;
                console.log('Employee role updated successfully!');
                init();
              });
            });
          });
        });
      });
    } else if (answers.todo === 'View Employees by Manager') {
      connection.query("SELECT DISTINCT m.id, m.first_name, m.last_name FROM employee e JOIN employee m ON e.manager_id = m.id ORDER BY m.last_name ASC", (error, results) => {
        if (error) throw error;
        const managers = results.map(result => ({ name: `${result.first_name} ${result.last_name}`, value: result.id }));
        inquirer.prompt([
          {
            type: 'list',
            message: "Select Manager.",
            name: 'manager',
            choices: managers
          }
        ])
          .then(managerChoice => {
            const managerId = managerChoice.manager;
            connection.query(`SELECT * FROM employee WHERE manager_id = ${managerId}`, (error, results) => {
              if (error) throw error;
              console.table(results);
              init();
            });
          });
      });
    } else if (answers.todo === 'Update Employee by Manager') {
      connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (error, results) => {
        if (error) throw error;
        const employeeChoices = results.map(result => ({ name: result.name, value: result.id }));
        inquirer.prompt([
          {
            type: 'list',
            message: "Select the employee you want to update the manager for:",
            name: 'employee_id',
            choices: employeeChoices
          },
          {
            type: 'list',
            message: "Select the new manager for this employee:",
            name: 'manager_id',
            choices: employeeChoices
          }
        ]).then((answers) => {
          const query = `UPDATE employee SET manager_id = ${answers.manager_id} WHERE id = ${answers.employee_id}`;
          connection.query(query, (error, results) => {
            if (error) throw error;
            console.log('Employee manager updated successfully!');
          });
        });
      });
    } else if (answers.todo === 'View All Departments') {
      connection.query('SELECT * FROM department', (error, results) => {
        if (error) throw error;
        console.table(results);
        init();
      });
    } else if (answers.todo === 'Add Department') {
      const departmentInfo = await inquirer.prompt([
        {
          type: 'input',
          message: "Enter name of department.",
          name: 'name',
        },
      ]);
      const query = 'INSERT INTO department SET ?';
      connection.query(query, departmentInfo, (error, results) => {
        if (error) throw error;
        console.log('New department added successfully!');
        init();
      });
    } if (answers.todo === 'View Employee by Department') {
      connection.query('SELECT name FROM department', (error, results) => {
        if (error) throw error;
        const choices = results.map(result => ({ name: result.name, value: result.name }));
        inquirer.prompt([
          {
            type: 'list',
            message: 'Select a department',
            name: 'department',
            choices: choices
          }
        ]).then(answer => {
          const query = `SELECT employee.id, employee.first_name, employee.last_name FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.department_id = department.id WHERE department.name = ?`;
          connection.query(query, answer.department, (error, results) => {
            if (error) throw error;
            console.table(results);
          });
        });
      });
    }

    else if (answers.todo === 'View All Roles') {
      connection.query('SELECT * FROM roles', (error, results) => {
        if (error) throw error;
        console.table(results);
        init();
      });
    } else if (answers.todo === 'Add Role') {
      connection.query('SELECT name FROM department', (error, results) => {
        if (error) throw error;
        const choices = results.map(results => ({ name: results.name, value: results.name }));
        inquirer.prompt([
          {
            type: 'input',
            message: "Enter Title of role.",
            name: 'title',
          },
          {
            type: 'input',
            message: "Enter salary of role.",
            name: 'salary',
          },
          {
            type: 'list',
            message: "Select department id of role.",
            name: 'department_id',
            choices: choices
          },
        ]).then(roleInfo => {
          const departmentName = roleInfo.department_id;
          connection.query(`SELECT id FROM department WHERE name ='${departmentName}'`, (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
              console.log('No department found');
              return;
            }
            const departmentId = results[0].id;
            const query = 'INSERT INTO roles SET ?';
            const role = {
              title: roleInfo.title,
              salary: roleInfo.salary,
              department_id: departmentId
            };
            connection.query(query, role, (error, results) => {
              if (error) throw error;
              console.log('New role added successfully!');
              init();
            });
          });
        });
      });
    } else if (answers.todo === 'Delete a Department'){
      connection.query('SELECT * FROM department', (error, results) => { 
        if (error) throw error;
        const choices = results.map(result =>({name:result.name, value:result.id})); 
        inquirer.prompt ([
          {
            type: 'list',
            message: "Select department to delete.",
            name: 'department',
            choices: choices
          },
          {
            type: 'confirm',
            message: "Are you sure you want to delete this department?",
            name: 'confirm',
            default: false
          }
        ]) .then(deleteInfo => {
          if (deleteInfo.confirm){
            const departmentId = deleteInfo.department;
            const query = 'DELETE FROM department WHERE id = ?';
            connection.query (query, departmentId, (error, results) => {
              if (error) throw error;
              console.log('Department deleted successfully!');
            });
          } else {
            console.log('Deletion cancelled.');
          }
        });
      });
    }
    else if (answers.todo === 'Quit') {
      console.log("Goodby!");
      process.exit(0);
    }
  });
}



// Function call to initialize app
init();