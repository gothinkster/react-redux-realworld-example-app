const API_ROOT = process.env.REACT_APP_BACKEND_URL ?? 'https://conduit.productionready.io/api';

const encode = encodeURIComponent;

let token = null;

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
    result = { statusCode: response.status, errors: [response.statusText] };
  }

  if (!response.ok) throw result;

  return result;
};

const requests = {
  del: url => agent(url, undefined, 'DELETE'),
  get: url => agent(url),
  put: (url, body) => agent(url, body, 'PUT'),
  post: (url, body) => agent(url, body, 'POST'),
};

const Auth = {
  current: () => requests.get('/user'),
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user => requests.put('/user', { user }),
};

const Tags = {
  getAll: () => requests.get('/tags'),
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;

const omitSlug = article => Object.assign({}, article, { slug: undefined });

const Articles = {
  all: page => requests.get(`/articles?${limit(10, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug => requests.del(`/articles/${slug}`),
  favorite: slug => requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () => requests.get('/articles/feed?limit=10&offset=0'),
  get: slug => requests.get(`/articles/${slug}`),
  unfavorite: slug => requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article => requests.post('/articles', { article }),
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug => requests.get(`/articles/${slug}/comments`),
};

const Profile = {
  follow: username => requests.post(`/profiles/${username}/follow`),
  get: username => requests.get(`/profiles/${username}`),
  unfollow: username => requests.del(`/profiles/${username}/follow`),
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: _token => {
    token = _token;
  },
};
