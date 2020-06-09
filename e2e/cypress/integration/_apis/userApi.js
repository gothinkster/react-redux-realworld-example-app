import '../../support/index'

const responseToToken = (resp) => {
    return resp.body['user'].token
}

const user = "jprealini@gmail.com"
const password = "jppooh74"

class userApi {
    userLogin() {
        cy.loginBySingleSignOn({ followRedirect: true }, user, password)
            .then(responseToToken)
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