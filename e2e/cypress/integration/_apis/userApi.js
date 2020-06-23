import '../../support/index'
import Helper from '../../support/helper'

const helper = new Helper();

class userApi {

    userLogin() {
        cy.loginBySingleSignOn({ followRedirect: true }, Cypress.env('user'), Cypress.env('password'))
            .then(helper.responseToToken)
            .then((id_token) => {
                // now go visit our app                
                cy.visit('/', {
                    onBeforeLoad(win) {
                        // and before the page finishes loading
                        // set the id_token in local storage
                        win.localStorage.setItem('jwt', id_token)
                    },
                })
                cy.wait(1000);
            })
    }
}

export default userApi;