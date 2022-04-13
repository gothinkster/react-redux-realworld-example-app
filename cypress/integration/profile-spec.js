// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import faker from 'faker';

describe('Profile page', () => {
  const firstname = faker.name.firstName();
  const lastname = faker.name.lastName();
  const username =
    faker.internet
      .userName(firstname, lastname)
      .toLowerCase()
      .replace(/\W/g, '_') + '_redux';
  const email = faker.internet
    .email(firstname, lastname, 'redux.js.org')
    .toLowerCase();

  before(() => {
    cy.task('createUserWithArticle', { username, email });

    cy.intercept('GET', '**/user')
      .as('getCurrentUser')
      .intercept('GET', `**/profiles/${username}`)
      .as('getProfile')
      .intercept('GET', `**/articles?author=${encodeURIComponent(username)}*`)
      .as('getArticlesByAuthor')
      .visit('/')
      .login()
      .visit(`/@${username}`)
      .wait(['@getCurrentUser', '@getProfile', '@getArticlesByAuthor']);
  });

  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop();
    }
  });

  it("should show the user's image and user's username in the banner", () => {
    cy.get('.user-info').within(() => {
      cy.findByRole('img', username).should('be.visible');

      cy.findByRole('heading', username).should('be.visible');
    });

    cy.get('.article-preview').its('length').should('be.above', 0);
  });

  it('should follow the user', () => {
    cy.intercept('POST', `**/profiles/${username}/follow`).as('followProfile');

    cy.findByRole('button', { name: `Follow ${username}` }).click();

    cy.wait('@followProfile').its('response.statusCode').should('equal', 200);
  });

  it('should unfollow the user', () => {
    cy.intercept('DELETE', `**/profiles/${username}/follow`).as(
      'unfollowProfile'
    );

    cy.findByRole('button', { name: `Unfollow ${username}` }).click();

    cy.wait('@unfollowProfile').its('response.statusCode').should('equal', 200);
  });
});
