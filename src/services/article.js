import superagentPromise from "superagent-promise";
import _superagent from "superagent";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "http://127.0.0.1:8081";
const responseBody = res => res.body;

const requests = {
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
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

export const searchArticles = searchInput => {
  const searchTerms = searchInput.split(" ");
  for (var i = 0; i < searchTerms.length; i++) {
    if (searchTerms[i].charAt(0) === '"' && i + 1 < searchTerms.length) {
      let foundClosingTag = false;
      let j = i + 1;
      do {
        if (searchTerms[j].charAt(searchTerms[j].length - 1) === '"') {
          searchTerms[i] += ` ${searchTerms[j].substr(
            0,
            searchTerms[j].length - 1
          )}`;
          foundClosingTag = true;
        } else {
          searchTerms[i] += ` ${searchTerms[j]}`;
        }
        delete searchTerms[j];
        j++;
      } while (!foundClosingTag);
    }
  }
  return requests.post("/search", searchTerms);
  0;
};
