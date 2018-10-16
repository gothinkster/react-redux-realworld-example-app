import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "http://127.0.0.1:8081";
const responseBody = res => res.body;

const requests = {
    post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).then(responseBody),
    get: (url, body) => superagent.get(`${API_ROOT}${url}`, body).then(responseBody)
};

export const SubmitArticle = article => {
    requests.post("/article/submit", article);    
};

export const fetchArticles = pageNumber => {
    //return up to ten articles based on their index in the database
    return requests.get(`/articles/${pageNumber}`).then(result => {
        return result;
    },
    err => {
        return err;
    });  

}

export const getArticleCount = () => {
    //return the number of articles in the database
    return requests.get("/article/count").then(result => {
        return result;
    },
    err => {
        return err;
    });  
};

