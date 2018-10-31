import { requests } from "../helpers/requests";

const authenticateUser = (email, password) => {
  return requests.post("/user/authenticate", { email, password }).then(
    result => {
      console.log(result);
      return result;
    },
    error => {
      console.log("received error");
      return { error: true };
    }
  );
};

export const registerUser = userData => {
  return requests.post("/user/create", userData);
};

export default authenticateUser;
