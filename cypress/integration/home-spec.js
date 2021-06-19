// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Home page', () => {
  beforeEach(() => {
    cy.intercept('**/articles?**')
      .as('getAllArticles')
      .intercept('**/tags')
      .as('getAllTags')
      .visit('/');
  });

  it('should show the app name', () => {
    cy.get('.banner').within(() => {
      cy.findByRole('heading', { level: 1, name: /conduit/i }).should(
        'be.visible'
      );

      cy.findByText('A place to share your knowledge.').should('be.visible');
    });
  });

  it('should have a header navbar', () => {
    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', { name: /conduit/i }).should(
        'have.attr',
        'href',
        '/'
      );

      cy.findByRole('link', { name: /home/i }).should('have.attr', 'href', '/');

      cy.findByRole('link', { name: /sign in/i }).should(
        'have.attr',
        'href',
        '/login'
      );
      cy.findByRole('link', { name: /sign up/i }).should(
        'have.attr',
        'href',
        '/register'
      );
    });
  });

  it('should render the list of articles', () => {
    cy.findByRole('button', { name: /global feed/i }).should('be.visible');

    cy.wait('@getAllArticles')
      .its('response.body')
      .then((body) => {
        cy.get('.article-preview').should('have.length', body.articles.length);

        Cypress._.each(body.articles, (article, index) => {
          cy.get('.article-preview')
            .eq(index)
            .within(() => {
              cy.findByRole('img', { name: article.author.username });

              cy.findByText(article.author.username);

              cy.findByRole('heading').should('have.text', article.title);

              cy.get('p').should('have.text', article.description);

              cy.findByRole('list')
                .children()
                .should('have.length', article.tagList.length);

              cy.findByRole('list').within(() => {
                Cypress._.each(article.tagList, (tag) => {
                  cy.findByText(tag);
                });
              });
            });
        });
      });
  });

  it('should render the list of tags', () => {
    cy.wait('@getAllTags')
      .its('response.body')
      .then((body) => {
        cy.get('.sidebar').within(() => {
          cy.findByText('Popular Tags');

          cy.findAllByRole('button').should('have.length', body.tags.length);
        });
      });
  });

  it('should show the pagination', () => {
    cy.wait('@getAllArticles')
      .its('response.body')
      .then((body) => {
        const pages = Math.floor(body.articlesCount / body.articles.length);

        cy.get('.pagination').within(() => {
          cy.findAllByRole('listitem').should('have.length.at.most', pages);
        });
      });
  });
});

describe('Home page (authenticated)', () => {
  beforeEach(() => {
    cy.task('createUserWithArticle', { followUser: true });

    cy.intercept('**/articles?*')
      .as('getAllArticles')
      .intercept('**/articles/feed?*')
      .as('getAllFeed')
      .intercept('**/tags')
      .as('getAllTags')
      .intercept('POST', '**/articles/*/favorite')
      .as('favoriteArticle')
      .intercept('DELETE', '**/articles/*/favorite')
      .as('unfavoriteArticle')
      .visit('/')
      .login();
  });

  it('should mark an article as favorite', () => {
    cy.findByRole('button', {
      name: /global feed/i,
    }).click();

    cy.wait('@getAllArticles')
      .its('response.body.articles')
      .then((articles) => {
        const article = articles[0];

        cy.findAllByRole('heading', { name: article.title })
          .first()
          .parent()
          .parent()
          .find('.article-meta')
          .within(() => {
            cy.findByRole('button').click();
          });
      });

    cy.wait('@favoriteArticle').its('response.statusCode').should('equal', 200);
  });

  it('should mark an article as unfavorite', () => {
    cy.findByRole('button', {
      name: /global feed/i,
    }).click();

    cy.wait('@getAllArticles')
      .its('response.body.articles')
      .then((articles) => {
        const article = articles[1];

        cy.findAllByRole('heading', { name: article.title })
          .first()
          .parent()
          .parent()
          .find('.article-meta')
          .within(() => {
            cy.findByRole('button').click();

            cy.wait('@favoriteArticle');

            cy.findByRole('button').click();
          });
      });

    cy.wait('@unfavoriteArticle')
      .its('response.statusCode')
      .should('equal', 200);
  });
});
