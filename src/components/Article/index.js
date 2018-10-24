import ArticleMeta from "./ArticleMeta";
import CommentContainer from "./CommentContainer";
import React from "react";
import { getArticle } from "../../services/article";
import { connect } from "react-redux";
import marked from "marked";
import {
  ARTICLE_PAGE_LOADED,
  ARTICLE_PAGE_UNLOADED
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
  ...state.article,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload => dispatch({ type: ARTICLE_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: ARTICLE_PAGE_UNLOADED })
});

class Article extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      errorLoading: false,
      article: {}
    };
  }

  componentDidMount() {
    const uuid =
      window.location.href.match(/\/\d+$/) !== null
        ? window.location.href
            .match(/\/\d+$/)[0]
            .slice(1, window.location.href.match(/\/\d+$/)[0].length)
        : null;
    if (uuid !== null) {
      const fetchArticle = new Promise(resolve => {
        resolve(getArticle(uuid));
      });

      fetchArticle.then(result => {
        if (result.hasOwnProperty("uuid")) {
          this.setState({ article: result, loading: false });
        } else {
          this.setState({ loading: false, errorLoading: true });
        }
      });
    } else {
      this.setState({ loading: false, errorLoading: true });
    }
  }

  render() {
    const { loading, errorLoading, article } = this.state;

    return (
      <React.Fragment>
        <div className="article-page">
          <div className="banner">
            <h1 className="container">{article.title}</h1>
          </div>

          <div className="container page">
            {loading ? <p>Loading...</p> : null}
            {errorLoading ? <p>404 - Resource Not Found</p> : null}
            {!loading &&
              !errorLoading && (
                <React.Fragment>
                  <p>
                    Link: <a href={article.url}>{article.url}</a>
                  </p>
                  <p>{article.type}</p>
                  <p>{article.summary}</p>
                  <p className="author-container">
                    Submitted by {article.author.username}
                  </p>
                  {article.snippets && (
                    <p className="snippet-container">
                      {" "}
                      {article.snippets.map((snippet, index) => {
                        return (
                          <span className="snippet-span" key={index}>
                            {snippet}
                          </span>
                        );
                      })}
                    </p>
                  )}
                </React.Fragment>
              )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Article);
