import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "http://127.0.0.1:8081";
const responseBody = res => res.body;

const requests = {
    post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
};

const SubmitArticle = article => {
    //initialize favoritesCount for article to zero
    article['favoritesCount'] = 0;
    //define slug
    article['slug'] = "";
    //generate timeStamp for article
    
    //append author data
    requests.post("/article/submit", article);    
};

export default SubmitArticle;