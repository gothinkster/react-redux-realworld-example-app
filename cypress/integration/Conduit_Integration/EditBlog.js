describe('Cypress test for editing blog successfully', function() {
    
    before(function () {
        cy.fixture('profile').then(function (data) {
          this.data = data;
        })
      })
    
    it('Login to application and edit the blog', function() {
    //Visit the Conduit - RealWorld Page 
    cy.OpenApplication(this.data.AppUrl);
    
    // Login to application
    cy.login(this.data.email, this.data.Password);

    // Verify username after login
    cy.get(':nth-child(4) > .nav-link').should('have.text',this.data.userName).click();

    cy.reload();
    //click on latest blog
    cy.get(':nth-child(1) > .preview-link > h1').click();

    //click on edit blog
    cy.get('.btn-outline-secondary').click(); 

    var EditedDesc = "This is edited";
    // Edit the article description
    cy.get(':nth-child(2) > .form-control').click().focused().clear().type('This is edited');

    //Publish the blog
    cy.get('.btn').click();
    cy.get(':nth-child(1) > .nav-link').click();
    cy.get(':nth-child(4) > .nav-link').click();

    cy.reload();

    //Verify edited blog  description
    cy.contains('edited').should('contain','edited');

})
})