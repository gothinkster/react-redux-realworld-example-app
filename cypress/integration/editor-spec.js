// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import faker from 'faker';

import { createArticle } from '../../src/reducers/article';

const titlePlaceholder = 'Article Title';
const descriptionPlaceholder = "What's this article about?";
const bodyPlaceholder = 'Write your article (in markdown)';
const tagPlaceholder = 'Enter tags';
const submitButton = 'Publish Article';

describe('New article', () => {
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
      faker.lorem.sentence(),
      { delay: 1 }
    );

    cy.findByPlaceholderText(bodyPlaceholder).type(faker.lorem.paragraphs(), {
      delay: 1,
    });

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

describe('Edit article', () => {
  let article;

  before(() => {
    cy.intercept('GET', '**/articles/*')
      .as('getArticle')
      .intercept('GET', '**/articles/*/comments')
      .as('getCommentsForArticle');

    cy.visit('/')
      .login()
      .createArticle()
      .then((newArticle) => {
        article = newArticle;

        cy.dispatch({
          type: createArticle.fulfilled.type,
          payload: { article },
        }).wait(['@getArticle', '@getCommentsForArticle']);

        cy.findByRole('link', {
          name: /edit article/i,
        }).click();

        cy.wait('@getArticle');
      });
  });

  it("should fill the form with article's data", () => {
    cy.findByPlaceholderText(titlePlaceholder).should(
      'have.value',
      article.title
    );

    cy.findByPlaceholderText(descriptionPlaceholder).should(
      'have.value',
      article.description
    );

    cy.findByPlaceholderText(bodyPlaceholder).should(
      'have.value',
      article.body
    );

    cy.findByPlaceholderText(tagPlaceholder).should('have.value', '');

    cy.get('.tag-list')
      .children()
      .should('have.length', article.tagList.length);

    cy.get('.tag-list').within(() => {
      Cypress._.each(article.tagList, (tag) => {
        cy.findByText(RegExp(`^${tag}$`, 'i')).should('exist');
      });
    });
  });

  it('should update the article', () => {
    const description = faker.lorem.paragraph();

    cy.intercept('PUT', '**/articles/*').as('updateArticle');

    cy.findByPlaceholderText(descriptionPlaceholder).clear().type(description);

    cy.get('.tag-list').within(() => {
      Cypress._.each(article.tagList, (tag) => {
        cy.findByText(RegExp(`^${tag}$`, 'i'))
          .find('i')
          .click();
      });
    });

    cy.findByPlaceholderText(tagPlaceholder).type(
      'react{enter}redux{enter}markdown{enter}lorem ipsum{enter}'
    );

    cy.findByRole('button', { name: submitButton }).click();

    cy.wait('@updateArticle')
      .its('response')
      .then((response) => {
        expect(response.statusCode).to.equal(200);

        expect(response.body.article).to.haveOwnProperty(
          'description',
          description
        );
        expect(response.body.article).to.haveOwnProperty('tagList');
        expect(response.body.article.tagList).to.deep.equal([
          'react',
          'redux',
          'markdown',
          'lorem ipsum',
        ]);
      });

    cy.location('pathname').should('match', /\/article\/[\w-]+/);
  });
});
