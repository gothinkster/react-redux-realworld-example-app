describe('Sign in', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/login', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });
  });

  it('Should appear the page title', () => {
    cy.get('.auth-page h1').contains('Sign In');
  });

  it('Should fail with invalid credentials', () => {
    cy.route({
      method: 'POST',
      url: /.*\/api\/users/,
      status: 422,
      response: {
        errors: { 'email or password': ['is invalid'] }
      }
    }).as('postUser');

    cy.get('input[placeholder="Email"]').type('joe@doe.me');
    cy.get('input[placeholder="Password"]').type('123456{enter}');

    cy.wait('@postUser');
    cy.get('.auth-page .error-messages > li');
  });

  it('Should success with valid credentials', () => {
    const registeredUser = {
      username: 'joe_doe',
      email: 'joe@doe.me',
      password: 'P4$$w0rd'
    };

    cy.route('POST', /.*\/api\/users/, {
      user: {
        id: Date.now(),
        email: registeredUser.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: registeredUser.username,
        bio: null,
        image: null,
        token: 'jwt'
      }
    }).as('postUser');
    cy.route(/.*\/api\/tags/, 'fixture:tags.json').as('loadTags');
    cy.route(/.*\/api\/articles\/feed(\?limit=(\d+)&offset=(\d+))?/, {
      articles: [],
      articlesCount: 0
    }).as('loadFeed');

    cy.get('input[placeholder="Email"]').type(registeredUser.email);
    cy.get('input[placeholder="Password"]').type(`${registeredUser.password}{enter}`);

    cy.wait(['@postUser', '@loadTags', '@loadFeed']);

    cy.get(`a[href="/@${registeredUser.username}"]`).contains(registeredUser.username);
  });

  afterEach(() => {
    cy.screenshot();
    cy.reload();
  });
});