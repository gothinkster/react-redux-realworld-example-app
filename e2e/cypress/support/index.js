// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
import { Before, After } from 'cypress-cucumber-preprocessor/steps'
import ArticleApi from '../integration/_apis/articlesApi';
import UserAPi from '../integration/_apis/userApi'
import Helper from '../support/helper'

const helper = new Helper();
const userApi = new UserAPi();
const articleApi = new ArticleApi();
const apiBaseUrl = Cypress.env('apiBaseUrl')


Before({ tags: "@articles" }, () => {
    if (Cypress.env('Token').length == 0) {
        cy.loginBySingleSignOn({ followRedirect: true }, Cypress.env('user'), Cypress.env('password'))
            .then(helper.responseToToken)
            .then((id_token) => {
                Cypress.env('Token', id_token)
                articleApi.deleteAllArticles();
                cy.fixture('articles').then((fixture) => {
                    //fixture.article.title = "Whatever"
                    articleApi.createArticles(id_token, fixture)
                })
            })
    } else {
        articleApi.deleteAllArticles();
        cy.fixture('articles').then((fixture) => {
            //fixture.article.title = "Whatever"
            articleApi.createArticles(Cypress.env('Token'), fixture)
        })
    }

})

After({ tags: "(not @articles) and (not @smoke)" }, () => {
    articleApi.deleteAllArticles();
})
