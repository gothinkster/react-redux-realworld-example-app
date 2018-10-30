import users from "../data/users";
import superagentPromise from "superagent-promise";
import _superagent from "superagent";
import { request } from "http";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "http://127.0.0.1:8081";
const responseBody = res => res.body;

const requests = {
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).then(responseBody),
  get: (url, body) =>
    superagent.get(`${API_ROOT}${url}`, body).then(responseBody)
};

const authenticateUser = (email, password) => {
  requests.post("/user/authenticate", { email, password }).then(
    result => {
      return result;
    },
    error => {
      return { error: true };
    }
  );
};

export const registerUser = userData => {
  requests.post("/user/create", userData);
};

export default authenticateUser;
