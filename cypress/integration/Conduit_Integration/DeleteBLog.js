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

    //Click on delete blog button
    cy.get('.btn-outline-danger').click()
    
    })

})

