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
      choices: ["View All Employees", "Add Employee", "Delete an Employee", "Update Employee Role", "View Employees by Manager", "Update Employee by Manager", "View Employee by Department", "View All Roles", "Add Role", "Delete a Role", "View All Departments", "View Budget of Departments", "Add Department", "Delete a Department", "Quit"]
    },

  ]).then(async (answers) => {
    if (answers.todo === 'View All Employees') {
      //grabs the results from the database
      connection.query('SELECT * FROM employee', (error, results) => {
        if (error) throw error;
        //takes the results and displays them in a table
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
      //takes the updates employee info and inserts it into the database
      const query = 'INSERT INTO employee SET ?';
      connection.query(query, employeeInfo, (error, results) => {
        if (error) throw error;
        console.log('New employee added successfully!');
        init();

      });
    } else if (answers.todo === 'Delete an Employee'){
      connection.query('SELECT * FROM employee', (error, results) => { 
        if (error) throw error;
        //grabs the employees to display them in the prompt window for selections
        const choices = results.map(result =>({ name: `${result.first_name} ${result.last_name}`, value: result.id }));
        inquirer.prompt ([
          {
            type: 'list',
            message: "Select an employee to delete.",
            name: 'employee',
            choices: choices
          },
          {
            type: 'confirm',
            message: "Are you sure you want to delete this employee?",
            name: 'confirm',
            default: false
          }
        ]) .then(employeeInfo => {
          if (employeeInfo.confirm){
            //deletes the employee by id from the database after selections
            const query = 'DELETE FROM employee WHERE id = ?';
            connection.query(query, employeeInfo.employee, (error, result) => {
              if (error) throw error;
              console.log('Employee deleted successfully!');
              init();
            });
          } else {
            console.log('Deletion cancelled.');
            init();
          }
        });
      });
    }
    
    else if (answers.todo === 'Update Employee Role') {
      // Gets the employees form the database and combines first and last name together by id
      connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (error, results) => {
        if (error) throw error;

        // Prompt the user to select an employee from the list
        inquirer.prompt({
          type: 'list',
          name: 'employee',
          message: 'Select an employee:',
          choices: results.map(result => ({ name: result.name, value: result.id }))
        }).then(employeeInfo => {
          // grabs the roles by id from database
          connection.query('SELECT id, title FROM roles', (error, results) => {
            if (error) throw error;

            // Prompt the user to select a new role from the list
            inquirer.prompt({
              type: 'list',
              name: 'role',
              message: 'Select a new role:',
              choices: results.map(result => ({ name: result.title, value: result.id }))
            }).then(roleInfo => {
              // Update the employee's role in the database by displaying the roles available
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
      //this grabs the information of an employee by it's manager with the m. meaning manager and e meaining employee
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
            //this grabs the information to dispaly it in a table based on parameters
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
            init();
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
    } else if (answers.todo === 'Delete a Role'){
      connection.query('SELECT * FROM roles', (error, results) => {
        if (error) throw error;
        const choices = results.map(result =>({ name:result.title, value:result.id }));
        inquirer.prompt ([
          {
            type: 'list',
            message: "Select a role to delete.",
            name: 'role',
            choices: choices
          },
          {
            //confirming they do want to delete
            type: 'confirm',
            message: "Are you sure you want to delete this role?",
            name: 'confirm',
            default: false
          }
        ]) .then(roleInfo => {
          if (roleInfo.confirm){
            const roleId = roleInfo.role;
            //updating the database with deleted employee
            connection.query('UPDATE employee SET role_id = NULL WHERE role_id = ?', [roleId], (error, result) => {
              if (error) throw error;
              connection.query('DELETE FROM roles WHERE id = ?', [roleId], (error, result) => {
                if (error) throw error;
                console.log('Role deleted successfully!');
                //returning user to menu
                init();
              });
            });
          } else {
            console.log('Deletion cancelled.');
            init();
          }
        });
      });  
    }else if (answers.todo === 'View All Departments') {
      connection.query('SELECT * FROM department', (error, results) => {
        if (error) throw error;
        console.table(results);
        init();
      });
    }else if (answers.todo === 'View Budget of Departments') {
        connection.query('SELECT id, name FROM department', (error, results) => {
          if (error) throw error;
      
          const choices = results.map(result => ({ name: result.name, value: result.id }));
      
          inquirer.prompt([
            {
              type: 'list',
              name: 'department',
              message: 'Which department would you like to view the utilized budget for?',
              choices: choices
            },
            {
              type: 'confirm',
              name: 'confirm',
              message: 'Are you sure you want to view the utilized budget for this department?',
              default: false
            }
          ]).then(departmentInfo => {
            if (departmentInfo.confirm) {
              const query = 'SELECT SUM(salary) AS total_budget FROM roles WHERE department_id = ?';
      
              connection.query(query, departmentInfo.department, (error, results) => {
                if (error) throw error;
      
                console.log(`The total utilized budget for this department is $${results[0].total_budget}`);
                init();
              });
            } else {
              console.log('Viewing of total utilized budget cancelled.');
              init();
            }
          });
        });
    } else if (answers.todo === 'Add Department') {
      const departmentInfo = await inquirer.prompt([
        {
          type: 'input',
          message: "Enter name of department.",
          name: 'name',
        },
      ]);
      //insterting new department into the database
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
          //grabbomg the informations to return it into the database and display in a table
          const query = `SELECT employee.id, employee.first_name, employee.last_name FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.department_id = department.id WHERE department.name = ?`;
          connection.query(query, answer.department, (error, results) => {
            if (error) throw error;
            console.table(results);
            init();
          });
        });
      });
    }else if (answers.todo === 'Delete a Department'){
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
              init();
            });
          } else {
            console.log('Deletion cancelled.');
            init();
          }
        });
      });
    }
    else if (answers.todo === 'Quit') {
      console.log("Goodby!");
      //taking user out of the terminal
      process.exit(0);
    }
  });
}



// Function call to initialize app
init();