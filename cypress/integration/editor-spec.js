// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import faker from 'faker';

describe('New post', () => {
  const titlePlaceholder = 'Article Title';
  const descriptionPlaceholder = "What's this article about?";
  const bodyPlaceholder = 'Write your article (in markdown)';
  const tagPlaceholder = 'Enter tags';
  const submitButton = 'Publish Article';

  beforeEach(() => {
    cy.visit('/').login();

    cy.intercept('POST', '**/articles').as('createArticle');

    cy.findByRole('link', {
      name: /new post/i,
    }).click();
  });

  it('should submit a new article', () => {
    cy.findByPlaceholderText(titlePlaceholder).type(faker.lorem.words());

    cy.findByPlaceholderText(descriptionPlaceholder).type(
      faker.lorem.sentences()
    );

    cy.findByPlaceholderText(bodyPlaceholder).type(faker.lorem.paragraphs());

    cy.findByPlaceholderText(tagPlaceholder).type(
      'react{enter}redux{enter}lorem ipsum{enter}'
    );

    cy.findByRole('button', { name: submitButton }).click();

    cy.wait('@createArticle').its('response.statusCode').should('equal', 200);

    cy.location('pathname').should('match', /\/article\/[\w-]+/);
  });

  it('should validate the form', () => {
    cy.findByRole('button', { name: submitButton }).click();

    cy.wait('@createArticle').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findAllByRole('listitem').should('have.length', 3);
    });
  });

  it('should add or remove tags', () => {
    cy.get('.tag-list').as('tagList').should('be.empty');

    cy.findByPlaceholderText(tagPlaceholder).type(
      'lorem{enter}ipsum{enter}dolor{enter}sit{enter}amet{enter}'
    );

    cy.get('@tagList').children().should('have.length', 5);

    cy.get('@tagList').within(() => {
      cy.findByText('dolor').find('i').click();
      cy.findByText('sit').find('i').click();
    });

    cy.get('@tagList').children().should('have.length', 3);
  });
});
