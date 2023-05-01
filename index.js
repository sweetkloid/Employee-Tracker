// Packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');

// The input array that node will use in the terminal
inquirer.prompt([
  {
    type: 'list',
    message: 'Please select what what you would like to do.',
    name: 'todo',
   choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"] 
  },
  
]).then(async (answers) => {
  if (answers.todo === 'View All Employees') {
    const employees = await db.query();
    console.table(employees);
  } else if (answers.action === 'Add an employee') {
    // TODO: Implement add employee functionality
  } else if (answers.action === 'Update an employee') {
    // TODO: Implement update employee functionality
  } else if (answers.action === 'Delete an employee') {
    // TODO: Implement delete employee functionality
  }
});

function init() {
}

// Function call to initialize app
init();