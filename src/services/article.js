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
  article.tags = article.tags
    .sort()
    .map(tag => tag.toLowerCase())
    .filter((tag, index, arr) => {
      return !index || tag !== arr[index - 1];
    });

  requests.post("/article/submit", article);
};

export const loadArticles = currentPage => {};

export const searchArticles = searchInput => {
  const removeOpeningQuote = term => {
    return term.substr(1, term.length - 1);
  };

  const removeClosingQuote = term => {
    return term.substr(0, term.length - 2);
  };

  let searchTerms = searchInput.split(" ");
  for (let i = 0; i < searchTerms.length; i++) {
    if (searchTerms[i] && searchTerms[i].charAt(0) === '"') {
      searchTerms[i] = removeOpeningQuote(searchTerms[i]);
      if (searchTerms[i].charAt(searchTerms[i].length - 1) === '"') {
        searchTerms[i] = removeClosingQuote(searchTerms[i]);
      } else if (i + 1 < searchTerms.length) {
        let foundClosingTag = false;
        let j = i + 1;
        do {
          if (searchTerms[j].charAt(searchTerms[j].length - 1) === '"') {
            searchTerms[i] += ` ${removeClosingQuote(searchTerms[j])}`;
            foundClosingTag = true;
          } else {
            searchTerms[i] += ` ${searchTerms[j]}`;
          }
          delete searchTerms[j];
          j++;
        } while (!foundClosingTag);
      }
    }
  }

  searchTerms = searchTerms.filter(searchTerm => {
    return searchTerm !== undefined;
  });

  return requests.post("/search", searchTerms).then(
    result => {
      return result;
    },
    error => {
      return error;
    }
  );
};

export const fetchArticles = pageNumber => {
  return requests.get(`/articles/${pageNumber}`).then(
    result => {
      return result;
    },
    error => {
      return error;
    }
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
export const fetchAllTags = () => {
  return requests.get("/tags/all").then(
    result => {
      return result;
    },
    error => {
      return error;
    }
  );
};
