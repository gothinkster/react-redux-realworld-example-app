import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "http://127.0.0.1:8081";
const responseBody = res => res.body;

const requests = {
    post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
};

const SubmitArticle = article => {
    requests.post("/article/submit", article);    
};

const fetchArticles = pageNumber => {
    //return up to ten articles based on their index in the database
    const index = pageNumber -1;
}

const getArticleCount = () => {
    //return the number of articles in the database
    const count = requests.post("/article/count");  
    return count;
};

export default SubmitArticle;