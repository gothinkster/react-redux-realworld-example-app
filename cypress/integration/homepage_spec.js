describe('Homepage', () => {
  beforeEach(() => {
    cy.server();
    cy
      .route(
        /.*\/api\/articles(\?limit=(\d+)&offset=(\d+))?/,
        'fixture:articles.json'
      )
      .as('loadArticles');
    cy.route(/.*\/api\/tags/, 'fixture:tags.json').as('loadTags');

    cy.visit('/', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });
    cy.wait(['@loadArticles', '@loadTags']);
  });

  it('Should the page title must be set', () => {
    cy.title().should('include', 'Conduit');
    cy.screenshot();
  });

  context('Query DOM', () => {
    it('Should have a header navbar', () => {
      cy.get('.navbar').as('navbar');

      cy.get('@navbar').should('be.visible');
      cy.get('@navbar').within(() => {
        cy.get('a').as('navbarButtons');

        cy.get('@navbarButtons').its('length').should('be.gte', 4);
        cy
          .get('@navbarButtons')
          .contains('conduit')
          .should('have.attr', 'href', '/');
        cy
          .get('@navbarButtons')
          .contains('Home')
          .should('have.attr', 'href', '/');
        cy
          .get('@navbarButtons')
          .contains('Sign in')
          .should('have.attr', 'href', '/login');
        cy
          .get('@navbarButtons')
          .contains('Sign up')
          .should('have.attr', 'href', '/register');
      });
    });

    it('Should have a banner container', () => {
      cy.get('.banner').as('banner');

      cy.get('@banner').within(() => {
        cy.get('h1').contains('conduit').should('be.visible');
        cy.get('p').should('be.visible');
      });
    });

    it('Should have a main container with articles and tags', () => {
      cy.get('.page').as('main');

      cy.get('@main').within(() => {
        cy.get('.feed-toggle').contains('Global Feed');
        cy
          .get('.article-preview')
          .as('articles')
          .its('length')
          .should('be.lte', 10);

        cy.get('@articles').each($el => {
          cy.wrap($el).as('preview');
          cy.get('@preview').get('a > img');
          cy.get('@preview').get('.info > a, .info > span');
          cy
            .get('@preview')
            .get('button > i')
            .should('have.class', 'ion-heart');
          cy.get('@preview').get('.preview-link').within(() => {
            cy.get('h1, p, span, ul.tag-list');
            cy.get('span').contains('Read more...');
          });
        });

        cy.get('.sidebar').within(() => {
          cy.get('p').contains('Popular Tags');
          cy.get('.tag-list').its('length').should('be.gte', 0);
        });

        cy.get('.pagination').within(() => {
          cy.get('.page-item').its('length').should('be.gt', 1);
        });
      });
    });
  });

  context('Navigation links', () => {
    afterEach(() => {
      cy.screenshot();
      cy.go('back');
    });

    it('Should navigate to Login page', () => {
      cy.get('a.nav-link').contains('Sign in').click();

      cy.location('pathname').should('be.equal', '/login');
      cy.get('h1').contains('Sign In');
    });

    it('Should navigate to Register page', () => {
      cy.get('a.nav-link').contains('Sign up').click();

      cy.location('pathname').should('be.equal', '/register');
      cy.get('h1').contains('Sign Up');
    });

    it('Should navigate to first article', () => {
      const slug = 'how-to-train-your-dragon';
      const title = 'How to train your dragon';

      cy.getArticle(slug).as('articleLoaded');
      cy.route(/.*\/api\/articles\/[\w-]+/, '@articleLoaded').as('loadArticle');
      cy
        .route(/.*\/api\/articles\/[\w-]+\/comments/, 'fixture:comments.json')
        .as('loadComments');
      cy.get('.preview-link').eq(0).contains('Read more...').click();
      cy.wait(['@loadArticle', '@loadComments']);

      cy.location('pathname').should('match', /\/article\/[\w-]+/);
      cy.get('h1').contains(title);
    });

    it('Should navigate to the next page', () => {
      cy.get('.page-item').contains('2').as('nextPage');
      cy.get('@nextPage').click();
      cy.get('@nextPage').parent().should('have.class', 'active');
      cy
        .get('@nextPage')
        .parent()
        .siblings(':not(.active)')
        .its('length')
        .should('be', 0);
    });
  });

  context('Filter articles by tag', () => {
    const tag = 'dragons';

    beforeEach(() => {
      cy.getArticlesByTag(tag).as('articlesByTagLoaded');
      cy
        .route(
          /.*\/api\/articles\?tag=(\w+)(&limit=(\d+)&offset=(\d+))?/,
          '@articlesByTagLoaded'
        )
        .as('loadArticlesByTag');

      cy.get('.tag-list a.tag-pill').contains(tag).click();
    });

    it('Should not navigate away from homepage', () => {
      cy.location('pathname').should('to.be', '/');
    });

    it('Should show the tag as active', () => {
      cy.get('.feed-toggle').contains(tag).should('have.class', 'active');
    });

    it('Should filter articles list by tag', () => {
      cy
        .get('.article-preview')
        .as('articles')
        .its('length')
        .should('be.lte', 10);
      cy.get('@articles').each($el => {
        cy.wrap($el).find('.tag-pill').should($pills => {
          const tags = $pills.map((idx, el) => Cypress.$(el).text());

          expect(tags.get()).to.include(tag);
        });
      });
    });

    afterEach(() => {
      cy.screenshot();
      cy.reload();
    });
  });
});
