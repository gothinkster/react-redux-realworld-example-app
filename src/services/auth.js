<<<<<<< HEAD
import users from "../data/users.json"

=======
import users from "../data/users";
>>>>>>> 9024a8da8e3893999d90f2aa13d20db8347478a6

const authenticateUser = (email, password) => {

    for (var user of users) {
        if (user.email.match(email)) {
            if (user.password.match(password)) {
                return {user: user}
<<<<<<< HEAD
            }
        }
    }

=======
            };
        };
    }

    return {error: true };
>>>>>>> 9024a8da8e3893999d90f2aa13d20db8347478a6
};

export default authenticateUser;