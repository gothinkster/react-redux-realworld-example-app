import users from "../data/users.json"


const authenticateUser = (email, password) => {

    for (var user of users) {
        if (user.email.match(email)) {
            if (user.password.match(password)) {
                return {user: user}
            }
        }
    }

};

export default authenticateUser;