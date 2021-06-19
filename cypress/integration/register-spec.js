// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import faker from 'faker';

describe('Register page', () => {
  const usernamePlaceholder = 'Username';
  const emailPlaceholder = 'Email';
  const passwordPlaceholder = 'Password';

  beforeEach(() => {
    cy.intercept('POST', '**/users').as('register').visit('/register');
  });

  it('should submit the register form', () => {
    cy.findByPlaceholderText(usernamePlaceholder).type(
      faker.internet.userName().toLowerCase().replace(/\W/g, '_').substr(0, 20)
    );

    cy.findByPlaceholderText(emailPlaceholder).type(
      faker.internet.exampleEmail().toLowerCase()
    );

    cy.findByPlaceholderText(passwordPlaceholder).type('Pa$$w0rd!');

    cy.findByRole('button', { name: /sign up/i }).click();

    cy.wait('@register').its('response.statusCode').should('equal', 200);

    cy.location('pathname').should('be.equal', '/');
  });

  it('should require all the fields', () => {
    cy.findByRole('button', { name: /sign up/i }).click();

    cy.wait('@register').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findAllByRole('listitem').should('have.length', 3);
    });
  });

  it('should require the username', () => {
    cy.findByPlaceholderText(emailPlaceholder).type(
      faker.internet.exampleEmail().toLowerCase()
    );

    cy.findByPlaceholderText(passwordPlaceholder).type(
      faker.internet.password()
    );

    cy.findByRole('button', { name: /sign up/i }).click();

    cy.wait('@register').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findByRole('listitem').should('contain.text', 'username');
    });
  });

  it('should require the email', () => {
    cy.findByPlaceholderText(usernamePlaceholder).type(
      faker.internet.userName().toLowerCase().replace(/\W/g, '_').substr(0, 20)
    );

    cy.findByPlaceholderText(passwordPlaceholder).type(
      faker.internet.password()
    );

    cy.findByRole('button', { name: /sign up/i }).click();

    cy.wait('@register').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findByRole('listitem').should('contain.text', 'email');
    });
  });

  it('should require the password', () => {
    cy.findByPlaceholderText(usernamePlaceholder).type(
      faker.internet.userName().toLowerCase().replace(/\W/g, '_').substr(0, 20)
    );

    cy.findByPlaceholderText(emailPlaceholder).type(
      faker.internet.email().toLowerCase()
    );

    cy.findByRole('button', { name: /sign up/i }).click();

    cy.wait('@register').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findByRole('listitem').should('contain.text', 'password');
    });
  });

  it('should navigate to login page', () => {
    cy.findByRole('link', { name: /have an account/i }).click();

    cy.location('pathname').should('be.equal', '/login');
  });
});
