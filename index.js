// Packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');

// The input array that node will use in the terminal
const questions = [
  {
    type: 'list',
    message: 'Please select what what you would like to do.',
    name: 'todo',
   choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"] 
  },
  
];

function init() {
}

// Function call to initialize app
init();