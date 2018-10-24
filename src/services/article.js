import superagentPromise from "superagent-promise";
import _superagent from "superagent";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "http://127.0.0.1:8081";
const responseBody = res => res.body;

const requests = {
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).then(responseBody),
  get: (url, body) =>
    superagent.get(`${API_ROOT}${url}`, body).then(responseBody)
};

export const SubmitArticle = (article, username) => {
  article["favoritesCount"] = 0;
  article["slug"] = article.title.replace(" ", "-");
  article["createdAt"] = new Date().toISOString();
  article["author"] = {
    username
  };
  article["tags"] = article["tags"]
    .sort()
    .map(tag => tag.toLowerCase())
    .filter((tag, index, arr) => {
      return !index || tag !== arr[index - 1];
    });

  requests.post("/article/submit", article);
};

export const fetchArticles = pageNumber => {
  return new Promise(
    requests.get(`/articles/${pageNumber}`).then(
      result => {
        return result;
      },
      error => {
        return error;
      }
    )
  );
};

export const getArticle = uuid => {
  return requests.get(`/article/${uuid}`).then(
    result => {
      return result;
    },
    error => {
      return error;
    }
  );
};

export const getArticleCount = () => {
  return requests.get("/article/count").then(
    result => {
      return result;
    },
    error => {
      return error;
    }
  );
};
