import superagent from "superagent"

const API_ROOT = "https://conduit.productionready.io/api"

const encode = encodeURIComponent
const responseBody = (res: { body: any }) => res.body

let token: null = null
const tokenPlugin = (req: { set: (arg0: string, arg1: string) => void }) => {
  if (token) {
    req.set("authorization", `Token ${token}`)
  }
}

const requests = {
  del: (url: any) => superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url: any) => superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url: any, body: any) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url: any, body: any) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
}

const Auth = {
  current: () => requests.get("/user"),
  login: (email: any, password: any) =>
    requests.post("/users/login", { user: { email, password } }),
  register: (username: any, email: any, password: any) =>
    requests.post("/users", { user: { username, email, password } }),
  save: (user: any) => requests.put("/user", { user }),
}

const Tags = {
  getAll: () => requests.get("/tags"),
}

const limit = (count: number, p: number) => `limit=${count}&offset=${p ? p * count : 0}`
const omitSlug = (article: any) => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: (page: any) => requests.get(`/articles?${limit(10, page)}`),
  byAuthor: (author: string | number | boolean, page: any) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag: string | number | boolean, page: any) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: (slug: any) => requests.del(`/articles/${slug}`),
  favorite: (slug: any) => requests.post(`/articles/${slug}/favorite`, undefined),
  favoritedBy: (author: string | number | boolean, page: any) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () => requests.get("/articles/feed?limit=10&offset=0"),
  get: (slug: any) => requests.get(`/articles/${slug}`),
  unfavorite: (slug: any) => requests.del(`/articles/${slug}/favorite`),
  update: (article: { slug: any }) =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: (article: any) => requests.post("/articles", { article }),
}

const Comments = {
  create: (slug: any, comment: any) => requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug: any, commentId: any) => requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: (slug: any) => requests.get(`/articles/${slug}/comments`),
}

const Profile = {
  follow: (username: any) => requests.post(`/profiles/${username}/follow`, undefined),
  get: (username: any) => requests.get(`/profiles/${username}`),
  unfollow: (username: any) => requests.del(`/profiles/${username}/follow`),
}

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token: any) => {
    token = _token
  },
}
