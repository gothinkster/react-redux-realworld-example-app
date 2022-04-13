const API_ROOT =
  process.env.REACT_APP_BACKEND_URL ?? 'https://conduit.productionready.io/api';

/**
 * Serialize object to URL params
 *
 * @param {Record<string, unknown>} object
 * @returns {String}
 */
function serialize(object) {
  const params = [];

  for (const param in object) {
    if (Object.hasOwnProperty.call(object, param) && object[param] != null) {
      params.push(`${param}=${encodeURIComponent(object[param])}`);
    }
  }

  return params.join('&');
}

let token = null;

/**
 *
 * @typedef {Object} ApiError
 * @property {{[property: string]: string}} errors
 */

/**
 * @typedef  {Object} UserAuth
 * @property {Object} user
 * @property {String} user.email
 * @property {String} user.username
 * @property {String} user.bio
 * @property {String} user.image
 * @property {String} user.token
 *
 * @typedef  {Object}  Profile
 * @property {String}  username
 * @property {String}  bio
 * @property {String}  image
 * @property {Boolean} following
 *
 * @typedef  {Object}   Tags
 * @property {String[]} tags
 *
 * @typedef  {Object}   Article
 * @property {String}   title
 * @property {String}   slug
 * @property {String}   body
 * @property {String}   description
 * @property {String[]} tagList
 * @property {Profile}  author
 * @property {Boolean}  favorited
 * @property {Number}   favoritesCount
 * @property {String}   createdAt
 * @property {String}   updatedAt
 *
 * @typedef  {Object}  ArticleResponse
 * @property {Article} article
 *
 * @typedef  {Object}    ArticlesResponse
 * @property {Article[]} articles
 * @property {Number}    articlesCount
 *
 * @typedef  {Object}  Comment
 * @property {String}  id
 * @property {String}  body
 * @property {Profile} author
 * @property {String}  createdAt
 * @property {String}  updatedAt
 *
 * @typedef  {Object}  CommentResponse
 * @property {Comment} comment
 *
 * @typedef  {Object}    CommentsResponse
 * @property {Comment[]} comments
 *
 * @typedef  {Object}  ProfileResponse
 * @property {Profile} profile
 */

/**
 * API client
 *
 * @param {String} url The endpoint
 * @param {Object} body The request's body
 * @param {('GET'|'DELETE'|'PUT'|'POST')} [method='GET'] The request's method
 *
 * @throws {@link ApiError API Error}
 *
 * @returns {Promise<Object>} API response's body
 */
const agent = async (url, body, method = 'GET') => {
  const headers = new Headers();

  if (body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Token ${token}`);
  }

  const response = await fetch(`${API_ROOT}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let result;

  try {
    result = await response.json();
  } catch (error) {
    result = { errors: { [response.status]: [response.statusText] } };
  }

  if (!response.ok) throw result;

  return result;
};

const requests = {
  /**
   * Send a DELETE request
   *
   * @param {String} url The endpoint
   * @returns {Promise<Object>}
   */
  del: (url) => agent(url, undefined, 'DELETE'),
  /**
   * Send a GET request
   *
   * @param {String} url The endpoint
   * @param {Object} [query={}] URL parameters
   * @param {Number} [query.limit=10]
   * @param {Number} [query.page]
   * @param {String} [query.author]
   * @param {String} [query.tag]
   * @param {String} [query.favorited]
   * @returns {Promise<Object>}
   */
  get: (url, query = {}) => {
    if (Number.isSafeInteger(query?.page)) {
      query.limit = query.limit ? query.limit : 10;
      query.offset = query.page * query.limit;
    }
    delete query.page;
    const isEmptyQuery = query == null || Object.keys(query).length === 0;

    return agent(isEmptyQuery ? url : `${url}?${serialize(query)}`);
  },
  /**
   * Send a PUT request
   *
   * @param {String} url The endpoint
   * @param {Record<string, unknown>} body The request's body
   * @returns {Promise<Object>}
   */
  put: (url, body) => agent(url, body, 'PUT'),
  /**
   * Send a POST request
   *
   * @param {String} url The endpoint
   * @param {Record<string, unknown>} body The request's body
   * @returns {Promise<Object>}
   */
  post: (url, body) => agent(url, body, 'POST'),
};

const Auth = {
  /**
   * Get current user
   *
   * @returns {Promise<UserAuth>}
   */
  current: () => requests.get('/user'),
  /**
   * Login with email and password
   *
   * @param {String} email
   * @param {String} password
   * @returns {Promise<UserAuth>}
   */
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  /**
   * Register with username, email and password
   *
   * @param {String} username
   * @param {String} email
   * @param {String} password
   * @returns {Promise<UserAuth>}
   */
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  /**
   * Update user
   *
   * @param {Object}  user
   * @param {String} [user.email]
   * @param {String} [user.username]
   * @param {String} [user.bio]
   * @param {String} [user.image]
   * @param {String} [user.password]
   * @returns {Promise<UserAuth>}
   */
  save: (user) => requests.put('/user', { user }),
};

const Tags = {
  /**
   * Get all tags
   *
   * @returns {Promise<Tags>}
   */
  getAll: () => requests.get('/tags'),
};

const Articles = {
  /**
   * Get all articles
   *
   * @param {Object} query Article's query parameters
   * @param {Number} [query.limit=10]
   * @param {Number} [query.page]
   * @param {String} [query.author]
   * @param {String} [query.tag]
   * @param {String} [query.favorited]
   * @returns {Promise<ArticlesResponse>}
   */
  all: (query) => requests.get(`/articles`, query),
  /**
   * Get all articles from author
   *
   * @param {String} author Article's author
   * @param {Number} [page]
   * @returns {Promise<ArticlesResponse>}
   */
  byAuthor: (author, page) =>
    requests.get(`/articles`, { author, limit: 5, page }),
  /**
   * Get all articles by tag
   *
   * @param {String} tag Article's tag
   * @param {Number} page
   * @returns {Promise<ArticlesResponse>}
   */
  byTag: (tag, page) => requests.get(`/articles`, { tag, page }),
  /**
   * Remove one article
   *
   * @param {String} slug Article's slug
   * @returns {Promise<{}>}
   */
  del: (slug) => requests.del(`/articles/${slug}`),
  /**
   * Favorite one article
   *
   * @param {String} slug Article's slug
   * @returns {Promise<ArticleResponse>}
   */
  favorite: (slug) => requests.post(`/articles/${slug}/favorite`),
  /**
   * Get article favorited by author
   *
   * @param {String} username Username
   * @param {Number} [page]
   * @returns {Promise<ArticlesResponse>}
   */
  favoritedBy: (username, page) =>
    requests.get(`/articles`, { favorited: username, limit: 5, page }),
  /**
   * Get all articles in the user's feed
   *
   * @param {Number} [page]
   * @returns {Promise<ArticlesResponse>}
   */
  feed: (page) => requests.get('/articles/feed', { page }),
  /**
   * Get one article by slug
   *
   * @param {String} slug Article's slug
   * @returns {Promise<ArticleResponse>}
   */
  get: (slug) => requests.get(`/articles/${slug}`),
  /**
   * Unfavorite one article
   *
   * @param {String} slug Article's slug
   * @returns {Promise<ArticleResponse>}
   */
  unfavorite: (slug) => requests.del(`/articles/${slug}/favorite`),
  /**
   * Update one article
   *
   * @param {Partial<Article>} article
   * @returns {Promise<ArticleResponse>}
   */
  update: ({ slug, ...article }) =>
    requests.put(`/articles/${slug}`, { article }),
  /**
   * Create a new article
   *
   * @param {Object}   article
   * @param {String}   article.title
   * @param {String}   article.description
   * @param {String}   article.body
   * @param {String[]} article.tagList
   * @returns {Promise<ArticleResponse>}
   */
  create: (article) => requests.post('/articles', { article }),
};

const Comments = {
  /**
   * Create a new comment for article
   *
   * @param {String} slug Article's slug
   * @param {Object} comment
   * @param {String} comment.body
   * @returns {Promise<CommentResponse>}
   */
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  /**
   * Remove one comment
   *
   * @param {String} slug Article's slug
   * @param {String} commentId Comment's id
   * @returns {Promise<{}>}
   */
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  /**
   * Get all comments for one article
   *
   * @param {String} slug Article's slug
   * @returns {Promise<CommentsResponse>}
   */
  forArticle: (slug) => requests.get(`/articles/${slug}/comments`),
};

const Profile = {
  /**
   * Follow another user
   *
   * @param {String} username User's username
   * @returns {Profile<ProfileResponse>}
   */
  follow: (username) => requests.post(`/profiles/${username}/follow`),
  /**
   * Get the profile of an user
   *
   * @param {String} username User's username
   * @returns {Profile<ProfileResponse>}
   */
  get: (username) => requests.get(`/profiles/${username}`),
  /**
   * Unfollow another user
   *
   * @param {String} username User's username
   * @returns {Profile<ProfileResponse>}
   */
  unfollow: (username) => requests.del(`/profiles/${username}/follow`),
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token) => {
    token = _token;
  },
};
