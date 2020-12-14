
describe('Cypress test for page open and registration', function() {
    before(function () {
        cy.fixture('profile').then(function (data) {
          this.data = data;
        })
      })

it('CLick on SignUp and and verify registartion', function() {

  //Visit the Conduit - RealWorld Page 
  cy.OpenApplication(this.data.AppUrl);
    //CLick on sign Up button
    cy.get(':nth-child(3) > .nav-link').click();

    // Enter registration details and signup
    cy.get(':nth-child(1) > .form-control').type(this.data.userName);

    cy.get(':nth-child(2) > .form-control').type(this.data.email);

    cy.get(':nth-child(3) > .form-control').type(this.data.Password);

    cy.get('.btn').click();

    // If user already exists show error
    if(this.data.userName.includes('nchaubey')) {

    cy.get('.error-messages > :nth-child(1)').should('contain','email has already been taken');

    cy.get('.error-messages > :nth-child(2)').should('contain','username has already been taken');
    }

   // If user in new, verify success
    else{
      cy.get(':nth-child(4) > .nav-link').should('have.text',this.data.userName);

    }

  //  cy.get(':nth-child(4) > .element-list > .menu-list > li').should('have.length',9);
})
})