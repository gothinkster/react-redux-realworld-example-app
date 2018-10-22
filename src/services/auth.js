import users from "../data/users";

const authenticateUser = (email, password) => {
  for (let user of users) {
    if (user.email.match(email) && user.password.match(password)) {
      return { user };
    }
  }

  return { error: true };
};

export default authenticateUser;
