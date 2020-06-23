import '../../support/index'

const apiBaseUrl = Cypress.env('apiBaseUrl')

class ArticlesApi {

  createArticle(id_token, fixture) {
    cy.request({
      method: 'POST',
      url: apiBaseUrl + 'articles',
      body: fixture,
      headers: {
        'Authorization': 'Token ' + id_token,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }

  createArticles(id_token, fixture) {
    for (let i = 0; i < fixture.length; i++) {
      cy.request({
        method: 'POST',
        url: apiBaseUrl + 'articles',
        body: fixture[i],
        headers: {
          'Authorization': 'Token ' + id_token,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
    }
  }

  deleteArticle(id_token, slug) {
    cy.request({
      method: 'DELETE',
      url: apiBaseUrl + 'articles/' + slug,
      headers: {
        'Authorization': 'Token ' + id_token,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }

  deleteAllArticles() {
    cy.request(apiBaseUrl + 'articles')
      .its('body')
      .then((body) => {
        if (body.articles.length > 0) {
          for (let i = 0; i < body.articles.length; i++) {
            this.deleteArticle(Cypress.env('Token'), body.articles[i]['slug'])
          }
        }
      });
  }
}

export default ArticlesApi;

