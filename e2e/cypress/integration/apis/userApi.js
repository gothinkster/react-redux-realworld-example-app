class userApi {
    userLogin(user, password) {
        cy.request({
            url: 'http://localhost:3000/api/users/login',
            method: 'POST',
            body: {
                "user":{
                    "email": user,
                    "password": password
                  }
            }
        }).then((response) => {
            if (response.status == 200)
                cy.visit('/')
        })
    }
}

export default userApi;