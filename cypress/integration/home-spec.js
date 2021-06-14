// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('RealWorld Frontend Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the app name', function () {
    cy.findByRole('heading', { level: 1, name: /conduit/i }).should(
      'be.visible'
    );
  });
});
