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
    cy.get(':nth-child(4) > .nav-link').should('have.text',this.data.userName);

    //click on Global Feed
    cy.get('.feed-toggle > .nav > :nth-child(2) > .nav-link').click();

    //Open a blogg to add comment
    cy.get(':nth-child(1) > .preview-link > h1').click()
    
    //Add a comment in a blog
    cy.get('.form-control').type('Comment added');

    cy.get('.btn').click();

    // Verify comment added successfully
    cy.get(':nth-child(1) > .card-block > .card-text').should('have.text','Comment added');

    //Verify username for comment added
    cy.get(':nth-child(1) > .card-footer > :nth-child(2)').should('have.text',this.data.userName);
    
    })

})
