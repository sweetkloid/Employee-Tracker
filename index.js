// Packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');

// The input array that node will use in the terminal
const questions = [
  {
    type: 'input',
    message: 'What is your projects title?',
    name: 'title',
  },
  
];

function init() {
}

// Function call to initialize app
init();