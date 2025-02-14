// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

///<reference types="cypress"/>
/// <reference types="cypress-xpath" />

/// <reference types = "moment"/>


import * as XLSX from 'xlsx'; // Import the xlsx library here

// Create a custom command to read Excel data
Cypress.Commands.add('readExcel', (filePath) => {
  return cy.fixture(filePath, 'binary').then((fileData) => {
    // Parse the binary data of the Excel file
    const workbook = XLSX.read(fileData, { type: 'binary' });
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const sheet = workbook.Sheets[sheetName];
    
    // Convert the sheet to JSON format
    const excelData = XLSX.utils.sheet_to_json(sheet);
    return excelData;
  });
});
  
