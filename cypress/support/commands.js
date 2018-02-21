// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const articlesFx = require('../fixtures/articles.json');

Cypress.Commands.add('getArticles', (limit = 10, offset = 0) => {
  if (articlesFx.articles.length > limit) {
    offset = offset < 0 ? 0 : offset;

    return Object.assign(articlesFx, {
      articles: articlesFx.articles.slice(
        offset,
        offset > 0 ? limit + offset : limit
      )
    });
  }

  return articlesFx;
});

Cypress.Commands.add('getArticlesByTag', (tag, limit = 10, offset = 0) =>
  Object.assign(articlesFx, {
    articles: articlesFx.articles.filter(article =>
      article.tagList.includes(tag)
    )
  })
);

Cypress.Commands.add('getArticle', slug => ({
  article: articlesFx.articles.filter(article => article.slug === slug)[0]
}));
