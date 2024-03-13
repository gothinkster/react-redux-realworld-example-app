// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import faker from 'faker';

describe('Settings page', () => {
  const imagePlaceholder = 'URL of profile picture';
  const bioPlaceholder = 'Short bio about you';
  const passwordPlaceholder = 'New Password';
  const submitButton = 'Update Settings';

  beforeEach(() => {
    cy.visit('/').login();

    cy.findByRole('link', {
      name: /settings/i,
    }).click();

    cy.intercept('PUT', '**/user').as('saveUser');
  });

  it("should update user's details", () => {
    cy.findByPlaceholderText(imagePlaceholder)
      .clear()
      .type(faker.image.avatar());

    cy.findByPlaceholderText(bioPlaceholder)
      .clear()
      .type(faker.hacker.phrase());

    cy.findByRole('button', { name: submitButton }).click();

    cy.wait('@saveUser').its('response.statusCode').should('equal', 200);

    cy.location('pathname').should('equal', '/');
  });

  it('should change the password', () => {
    cy.findByPlaceholderText(passwordPlaceholder).type(Cypress.env('password'));

    cy.findByRole('button', { name: submitButton }).click();

    cy.wait('@saveUser').its('response.statusCode').should('equal', 200);

    cy.location('pathname').should('equal', '/');
  });

  it('should logout the user', () => {
    cy.findByRole('button', { name: 'Or click here to logout.' }).click();

    cy.location('pathname').should('equal', '/');
  });
});
