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
}

export default ArticlesApi;

