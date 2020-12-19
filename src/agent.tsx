import superagent from "superagent"

const API_ROOT = "https://conduit.productionready.io/api"

const encode = encodeURIComponent
const responseBody = (res: { body: any }) => res.body

let token: string | null = null
const tokenPlugin = (req: { set: (arg0: string, arg1: string) => void }) => {
  if (token) {
    req.set("authorization", `Token ${token}`)
  }
}

const requests = {
  del: (url: string) => superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url: string) => superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url: string, body: any) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url: string, body: any) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
}

const Auth = {
  current: () => requests.get("/user"),
  login: (email: string, password: string) =>
    requests.post("/users/login", { user: { email, password } }),
  register: (username: string, email: string, password: string) =>
    requests.post("/users", { user: { username, email, password } }),
  save: (user: any) => requests.put("/user", { user }),
}

const Tags = {
  getAll: () => requests.get("/tags"),
}

const limit = (count: number, p?: number) => `limit=${count}&offset=${p ? p * count : 0}`
const omitSlug = (article: any) => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: (page?: number) => requests.get(`/articles?${limit(10, page)}`),
  byAuthor: (author: string | number | boolean, page?: number) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag: string | number | boolean, page?: number) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: (slug: string) => requests.del(`/articles/${slug}`),
  favorite: (slug: string) => requests.post(`/articles/${slug}/favorite`, undefined),
  favoritedBy: (author: string | number | boolean, page?: number) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () => requests.get("/articles/feed?limit=10&offset=0"),
  get: (slug: string) => requests.get(`/articles/${slug}`),
  unfavorite: (slug: string) => requests.del(`/articles/${slug}/favorite`),
  update: (article: { slug: string }) =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: (article: any) => requests.post("/articles", { article }),
}

const Comments = {
  create: (slug: string, comment: any) => requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug: string, commentId: number) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: (slug: string) => requests.get(`/articles/${slug}/comments`),
}

const Profile = {
  follow: (username: string) => requests.post(`/profiles/${username}/follow`, undefined),
  get: (username: string) => requests.get(`/profiles/${username}`),
  unfollow: (username: string) => requests.del(`/profiles/${username}/follow`),
}

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token: string | null) => {
    token = _token
  },
}
