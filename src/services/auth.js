import users from "../data/users";

const authenticateUser = (email, password) => {

    for (var user of users) {
        if (user.email.match(email)) {
            if (user.password.match(password)) {
                return {user: user}
            };
        };
    }

    return {error: true };
};

export default authenticateUser;