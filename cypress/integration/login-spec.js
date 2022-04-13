// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import faker from 'faker';

describe('Login page', () => {
  const emailPlaceholder = 'Email';
  const passwordPlaceholder = 'Password';

  beforeEach(() => {
    cy.intercept('POST', '**/users/login').as('login').visit('/login');
  });

  it('should submit the login form', () => {
    cy.findByPlaceholderText(emailPlaceholder).type(Cypress.env('email'));

    cy.findByPlaceholderText(passwordPlaceholder).type(Cypress.env('password'));

    cy.findByRole('button', { name: /sign in/i }).click();

    cy.wait('@login').its('response.statusCode').should('equal', 200);

    cy.location('pathname').should('be.equal', '/');

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', { name: RegExp(Cypress.env('username'), 'i') });
    });
  });

  it('should require all the fields', () => {
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.wait('@login').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1);
    });
  });

  it('should validate the email and password', () => {
    cy.findByPlaceholderText(emailPlaceholder).type(Cypress.env('email'));

    cy.findByPlaceholderText(passwordPlaceholder).type(
      faker.internet.password()
    );

    cy.findByRole('button', { name: /sign in/i }).click();

    cy.wait('@login').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findByRole('listitem').should(
        'have.text',
        'email or password is invalid'
      );
    });
  });

  it('should navigate to register page', () => {
    cy.findByRole('link', { name: /need an account/i }).click();

    cy.location('pathname').should('be.equal', '/register');
  });
});
