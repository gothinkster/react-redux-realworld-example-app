import { requests } from "../helpers/requests";

const authenticateUser = (email, password) => {
  return requests.post("/user/authenticate", { email, password });
};

export const registerUser = userData => {
  return requests.post("/user/create", userData);
};

export default authenticateUser;
