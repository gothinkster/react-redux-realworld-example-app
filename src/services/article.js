import { requests } from "../helpers/requests";

export const SubmitArticle = (article, username) => {
  article.favoritesCount = 0;
  article.slug = article.title.replace(/\s/g, "-");
  article.createdAt = new Date().toISOString();
  article.author = {
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

export const searchArticles = searchInput => {
  const findQuote = (term, pos) => {
    return term && term.charAt(pos) === '"';
  };

  const concatTerms = (term1, term2) => {
    return `${term1} ${term2}`;
  };

  const removeQuotes = term => {
    let ret = term;
    ret = term.split("");
    ret.shift();
    ret.pop();
    ret = ret.join("");
    return ret;
  };

  let searchTerms = searchInput.split(" ");

  for (let i = 0; i < searchTerms.length; i++) {
    if (findQuote(searchTerms[i], 0)) {
      if (findQuote(searchTerms[i], searchTerms[i].length - 1)) {
        searchTerms[i] = removeQuotes(searchTerms[i]);
      } else {
        searchTerms[i] = concatTerms(searchTerms[i], searchTerms[i + 1]);
        searchTerms.splice(i + 1, 1);
        i--;
      }
    }
  }

  return requests.post("/search", searchTerms).then(
    result => {
      return result;
    },
    error => {
      return error;
    }
  );
};

export const searchArticlesByTags = tags => {
  return requests.post("/search/tags", tags).then(
    result => {
      return result;
    },
    error => {
      return error;
    }
  );
};

export const fetchArticles = (pageNumber = 1) => {
  return requests.get(`/articles/${pageNumber}`);
};

export const getArticle = uuid => {
  return requests.get(`/article/${uuid}`);
};

export const fetchAllTags = () => {
  return requests.get("/tags/all");
};

export const addView = slug => {
  requests.post("/article/addView", { slug });
};
