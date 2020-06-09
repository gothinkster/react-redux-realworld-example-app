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
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const _ = Cypress._

Cypress.Commands.add('loginBySingleSignOn', (overrides = {}, user, password) => {
    Cypress.log({
        name: 'loginBySingleSignOn',
    })

    const options = {
        url: 'https://conduit.productionready.io/api/users/login',
        method: 'POST',
        qs: {
            redirectTo: 'http://localhost:4100/',
        },
        form: false, 
        body: {
            "user":{
                "email": user,
                "password": password
              }
        }
    }
    // allow us to override defaults with passed in overrides
    _.extend(options, overrides)
    cy.request(options)
})