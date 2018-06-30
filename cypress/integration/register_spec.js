describe('Registration', () => {
  beforeEach(() => {
    cy.server();
    cy
      .route(
        /.*\/api\/articles(\?limit=(\d+)&offset=(\d+))?/,
        'fixture:articles.json'
      )
      .as('loadArticles');
    cy.route(/.*\/api\/tags/, 'fixture:tags.json').as('loadTags');

    cy.visit('/register', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });
  });

  it('Should the page title must be set', () => {
    cy.get('.auth-page h1').contains('Sign Up');
  });

  it('Should the sign up form works', () => {
    cy.route({
      method: 'POST',
      url: /.*\/api\/users/,
      status: 200,
      response: {
        user: {
          id: Date.now() / 1000,
          email: 'john.doe@mail.wtf',
          createdAt: new Date(),
          updatedAt: new Date(),
          username: 'john.doe',
          bio: null,
          image: null,
          token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MzIwOTUsInVzZXJuYW1lIjoiQW1ldCB1dCB1dCIsImV4cCI6MTUzNTU1Mjk2OX0.yJKrKsYGuBw3fOvcxW7Llnuct6kCIHR0hakOxbemb7s'
        }
      }
    });

    cy.get('.auth-page form').as('form');

    cy.get('@form')
      .find('input[placeholder="Username"]')
      .type('john.doe');
    cy.get('@form')
      .find('input[placeholder="Email"]')
      .type('john.doe@mail.wtf');
    cy.get('@form')
      .find('input[placeholder="Password"]')
      .type('p4$$W0rd');
    cy.get('@form').submit();
  });

  it('Should fail when send empty form', () => {
    cy.route({
      method: 'POST',
      url: /.*\/api\/users/,
      status: 422,
      response: {
        errors: {
          email: ["can't be blank"],
          password: ["can't be blank"],
          username: [
            "can't be blank",
            'is too short (minimum is 1 character)',
            'is too long (maximum is 20 characters)'
          ]
        }
      }
    });

    cy.get('.auth-page form').submit();
    cy.get('.auth-page .error-messages');
  });
});
