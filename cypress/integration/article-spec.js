// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import faker from 'faker';

describe('Article page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/articles?*')
      .as('getAllArticles')
      .intercept('GET', '**/articles/*/comments')
      .as('getCommentsForArticle')
      .intercept('GET', '**/articles/*')
      .as('getArticle')
      .visit('/');

    cy.wait('@getAllArticles').get('.preview-link').first().click();
  });

  it('should show the article', () => {
    cy.wait('@getArticle')
      .its('response.body.article')
      .then((article) => {
        cy.location('pathname').should('equal', `/article/${article.slug}`);

        cy.findByRole('heading', { name: article.title }).should('be.visible');

        cy.get('.article-meta').within(() => {
          cy.findByRole('img', { name: article.author.username }).should(
            'be.visible'
          );

          cy.findByText(article.author.username).should('be.visible');
        });

        cy.get('.article-content .col-xs-12')
          .children()
          .first()
          .should('not.be.empty');

        cy.get('.tag-list')
          .children()
          .should('have.length', article.tagList.length);
      });
  });

  it('should require to be logged to comment', () => {
    cy.findByText(/to add comments on this article/i).should('be.visible');
  });
});

describe('Article page (authenticated)', () => {
  const commentPlaceholder = 'Write a comment...';
  const postCommentButton = 'Post Comment';

  beforeEach(() => {
    cy.intercept('GET', '**/articles?*')
      .as('getAllArticles')
      .intercept('GET', '**/articles/*/comments')
      .as('getCommentsForArticle')
      .intercept('GET', '**/articles/*')
      .as('getArticle')
      .intercept('POST', '**/articles/*/comments')
      .as('createComment')
      .intercept('DELETE', '**/articles/*/comments/*')
      .as('deleteComment')
      .visit('/')
      .login();

    cy.wait('@getAllArticles').get('.preview-link').first().click();
  });

  it('should show the comment box', () => {
    cy.wait(['@getArticle', '@getCommentsForArticle']);

    cy.get('.comment-form').should('exist');
  });

  it('should add a new comment', () => {
    const comment = faker.lorem.paragraph();

    cy.wait(['@getArticle', '@getCommentsForArticle']);

    cy.findByPlaceholderText(commentPlaceholder).type(comment);

    cy.findByRole('button', { name: postCommentButton }).click();

    cy.wait('@createComment').its('response.statusCode').should('equal', 200);

    cy.wait(100)
      .get('.card:not(form)')
      .first()
      .within(() => {
        cy.findByText(comment).should('exist');
      });
  });

  it('should validate the comment box', () => {
    cy.wait(['@getArticle', '@getCommentsForArticle']);

    cy.findByRole('button', { name: postCommentButton }).click();

    cy.wait('@createComment').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1);
    });
  });

  it('should remove my own comment', () => {
    const comment = faker.lorem.sentence();

    cy.wait(['@getArticle', '@getCommentsForArticle']);

    cy.findByPlaceholderText(commentPlaceholder).type(comment);

    cy.findByRole('button', { name: postCommentButton }).click();

    cy.wait('@createComment');

    cy.findByText(comment)
      .as('comment')
      .parent()
      .parent()
      .find('.mod-options i')
      .click();

    cy.wait('@deleteComment').its('response.statusCode').should('equal', 200);

    cy.findByText(comment).should('not.exist');
  });
});

describe('Article page (author)', () => {
  const commentPlaceholder = 'Write a comment...';
  const postCommentButton = 'Post Comment';

  beforeEach(() => {
    cy.intercept('GET', '**/articles/*')
      .as('getArticle')
      .intercept('GET', '**/articles/*/comments')
      .as('getCommentsForArticle')
      .intercept('POST', '**/articles/*/comments')
      .as('createComment')
      .intercept('DELETE', '**/articles/*')
      .as('deleteArticle');

    cy.visit('/')
      .login()
      .createArticle()
      .then((article) => {
        cy.visit(`/article/${article.slug}`);

        cy.wait(['@getArticle', '@getCommentsForArticle']);
      });
  });

  it('should add a new comment', () => {
    const comment = faker.lorem.paragraph();

    cy.findByPlaceholderText(commentPlaceholder).type(comment);

    cy.findByRole('button', { name: postCommentButton }).click();

    cy.wait('@createComment').its('response.statusCode').should('equal', 200);
  });

  it('should remove my article', () => {
    cy.findByRole('button', {
      name: /delete article/i,
    }).click();

    cy.wait('@deleteArticle').its('response.statusCode').should('equal', 200);

    cy.location('pathname').should('equal', '/');
  });
});
