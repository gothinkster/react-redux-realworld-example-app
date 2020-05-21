import { Given, When, Then, Before, After } from "cypress-cucumber-preprocessor/steps";
import '../../support/index'


Given(/^I visit the home page$/, () => {
    cy.visit('/')    
});

When(/^I sign in$/, () => {
	cy.get('a').contains('Sign in').click()
});

When(/^I type user and password$/, () => {
    cy.get('input[type=email]').type('jprealini@gmail.com')
    cy.get('input[type=password]').type('jppooh74')
    cy.get('button').contains('Sign in').click()
});

Then(/^I should login$/, () => {
    //cy.get('a').contains('Your Feed')
    cy.get('a').should('contain','Your Feed')
});
