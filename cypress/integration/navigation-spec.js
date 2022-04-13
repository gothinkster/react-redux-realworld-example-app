// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Navigation', () => {
  beforeEach(() => {
    cy.intercept('**/articles?*')
      .as('getAllArticles')
      .intercept('**/tags')
      .as('getAllTags')
      .intercept('**/articles/*/comments')
      .as('getCommentsForArticle')
      .intercept('**/articles/*')
      .as('getArticle')
      .visit('/');
  });

  it('should navigate to the login page', () => {
    cy.findByRole('link', { name: /sign in/i }).click();

    cy.location('pathname').should('be.equal', '/login');

    cy.findByRole('heading', { name: /sign in/i });
  });

  it('should navigate to the register page', () => {
    cy.findByRole('link', { name: /sign up/i }).click();

    cy.location('pathname').should('be.equal', '/register');

    cy.findByRole('heading', { name: /sign up/i });
  });

  it('should navigate to the first article', () => {
    cy.get('.preview-link')
      .first()
      .within(() => {
        cy.findByText('Read more...').click();

        cy.wait(['@getArticle', '@getCommentsForArticle']);

        cy.location('pathname').should('match', /\/article\/[\w-]+/);
      });
  });

  it('should navigate to the next page', () => {
    cy.wait('@getAllArticles')
      .its('response.body')
      .then((body) => {
        const pages = Math.floor(body.articlesCount / body.articles.length);

        for (let i = 1; i < 3; i++) {
          const page = Math.round(Math.random() * (pages - 2 + 1) + 2);

          cy.get('.pagination').findByText(page.toString()).click();

          cy.wait('@getAllArticles');

          cy.get('.pagination')
            .findByText(page.toString())
            .parent()
            .should('have.class', 'active');

          cy.get('.page-item:not(.active)')
            .its('length')
            .should('equal', pages - 1);
        }
      });
  });

  it('should navigate by tag', () => {
    cy.wait('@getAllTags')
      .its('response.body')
      .then(({ tags }) => {
        let tag = tags[Math.floor(Math.random() * tags.length)];

        cy.get('.sidebar').findByText(tag).click();

        cy.wait('@getAllArticles');

        cy.get('.feed-toggle').findByText(tag).should('have.class', 'active');

        cy.get('.pagination').findByText('2').click();

        cy.wait('@getAllArticles');

        tag = tags[Math.floor(Math.random() * tags.length)];

        cy.get('.sidebar').findByText(tag).click();

        cy.wait('@getAllArticles');
      });
  });
});

describe('Navigation (authenticated)', () => {
  beforeEach(() => {
    cy.intercept('**/articles?*')
      .as('getAllArticles')
      .intercept('**/tags')
      .as('getAllTags')
      .intercept(`**/profiles/*`)
      .as('getProfile')
      .visit('/')
      .login();
  });

  it('should switch between tabs', () => {
    cy.findByRole('button', {
      name: /global feed/i,
    }).click();

    cy.wait('@getAllArticles').its('response.statusCode').should('equal', 200);

    cy.findByRole('button', {
      name: /your feed/i,
    }).click();
  });

  it('should navigate to new post page', () => {
    cy.wait('@getAllTags');

    cy.findByRole('link', {
      name: /new post/i,
    }).click();

    cy.location('pathname').should('equal', '/editor');
  });

  it('should navigate to settings page', () => {
    cy.findByRole('link', {
      name: /settings/i,
    }).click();

    cy.location('pathname').should('equal', '/settings');
  });

  it('should navigate to my profile page', () => {
    cy.findByRole('navigation')
      .findByRole('link', {
        name: RegExp(Cypress.env('username')),
      })
      .click();

    cy.location('pathname').should('equal', `/@${Cypress.env('username')}`);

    cy.get('.user-info').within(() => {
      cy.findByRole('img', Cypress.env('username')).should('be.visible');

      cy.findByRole('heading', Cypress.env('username')).should('be.visible');
    });
  });

  it('should navigate to my favorited articles page', () => {
    cy.findByRole('navigation')
      .findByRole('link', {
        name: RegExp(Cypress.env('username')),
      })
      .click();

    cy.wait(['@getAllArticles', '@getProfile']);

    cy.get('.user-info').within(() => {
      cy.findByRole('img', Cypress.env('username')).should('be.visible');

      cy.findByRole('heading', Cypress.env('username')).should('be.visible');
    });

    cy.findByRole('link', {
      name: /favorited articles/i,
    }).click();

    cy.wait('@getAllArticles')
      .its('response.body')
      .then((body) => {
        const pages = Math.floor(body.articlesCount / body.articles.length);
        const page = Math.round(Math.random() * (pages - 2 + 1) + 2);

        cy.get('.pagination').findByText(page.toString()).click();

        cy.wait('@getAllArticles');
      });

    cy.location('pathname').should(
      'equal',
      `/@${Cypress.env('username')}/favorites`
    );
  });
});
