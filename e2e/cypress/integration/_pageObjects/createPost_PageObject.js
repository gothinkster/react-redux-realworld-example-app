class createPostPageObject {

    createPost(title, description, content) {

        cy.get('a[href="/editor"]').click()
        cy.get('input[placeholder="Article Title"]').type(title)
        cy.get('input[placeholder="What\'s this article about?"]').type(description)
        cy.get('textarea[placeholder="Write your article (in markdown)"]').type(content)
        cy.get('button').contains('Publish Article').click()        

    }
}

export default createPostPageObject;