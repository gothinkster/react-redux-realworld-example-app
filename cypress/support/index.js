/// <reference types="cypress" />
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import '@cypress/code-coverage/support';
import '@testing-library/cypress/add-commands';

import { LOGIN } from '../../src/constants/actionTypes';

/**
 * Dispatches a given Redux action straight to the application
 */
Cypress.Commands.add('dispatch', (action) => {
  expect(action).to.be.an('object').and.to.have.property('type');

  cy.window().its('store').invoke('dispatch', action);
});

/**
 * Login the user using the API, then dispatch the login action
 */
Cypress.Commands.add(
  'login',
  (email = Cypress.env('email'), password = Cypress.env('password')) => {
    cy.request({
      url: `${Cypress.env('apiUrl')}/users/login`,
      method: 'POST',
      body: { user: { email, password } },
    })
      .its('body')
      .then((body) => {
        cy.dispatch({ type: LOGIN, payload: body });
      });
  }
);
