describe('Cypress test for creating blog successfully', function() {
   
    before(function () {
        cy.fixture('profile').then(function (data) {
          this.data = data;
        })
      })
   

    it('Login to application and create a blog', function() {
    //Visit the Conduit - RealWorld Page 
    cy.OpenApplication(this.data.AppUrl);
    
    
    // Login to application
    cy.login(this.data.email, this.data.Password);

    // Verify username after login
    cy.get(':nth-child(4) > .nav-link').should('have.text',this.data.userName);

    
    // CLick on New Post tab
    cy.get('.container > .nav > :nth-child(2) > .nav-link').click();

    // Enter new article details
    cy.get(':nth-child(1) > .form-control').type("Test Article"+ Math.floor(Math.random() * 100));
    cy.get(':nth-child(2) > .form-control').type('This is test article');
    cy.get(':nth-child(3) > .form-control').type('jncoihfpimncknoifheklfnnvdkjnvwojnwlk');
    cy.get(':nth-child(4) > .form-control').type('test, Test, TEST'); 
    
    cy.get('.btn').click();

})
})