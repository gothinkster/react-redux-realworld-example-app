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
      article: {
        author: {
          username: ""
        },
        summary: "",
        type: "",
        snippets: ["a"]
      }
    };
  }
  componentWillMount() {
    /*
    this.props.onLoad(Promise.all([
      //agent.Articles.get(this.props.match.params.id),
      //agent.Comments.forArticle(this.props.match.params.id)
    ]));
    */
  }

  componentDidMount() {
    let uuid = window.location.href.match(/\/\d+$/)[0];
    uuid = uuid.slice(1, uuid.length);
    const fetchArticle = new Promise(
      resolve => {
        resolve(getArticle(uuid));
      },
      reject => {
        console.log(reject);
      }
    );

    fetchArticle.then(result => {
      this.setState({ article: result });
    });
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const { article } = this.state;
    if (!article) {
      return null;
    }
    console.log(typeof article.snippets[0]);
    return (
      <div>
        <div className="article-page">
          <div className="banner">
            <div className="container">
              <h1>{article.title}</h1>
            </div>
          </div>
        </div>
        <div className="container page">
          <div>
            Link: <a href={article.url}>{article.url}</a>
          </div>
          <div>{article.type}</div>
          <div>{article.summary}</div>
          <div className="author-container">
            Submitted by {article.author.username}
          </div>
          {article.snippets &&
            article.snippets.length > 0 && (
              <div className="snippet-container">
                {" "}
                {article.snippets.map((snippet, index) => {
                  return <span className="snippet-span">{snippet}</span>;
                })}
              </div>
            )}
        </div>
      </div>
    );
    /*
    const markup = { __html: marked(this.props.article.body, { sanitize: true }) };
    const canModify = this.props.currentUser &&
      this.props.currentUser.username === this.props.article.author.username;
    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{this.props.article.title}</h1>
            <ArticleMeta
              article={this.props.article}
              canModify={canModify} />

          </div>
        </div>

        <div className="container page">

          <div className="row article-content">
            <div className="col-xs-12">

              <div dangerouslySetInnerHTML={markup}></div>

              <ul className="tag-list">
                {
                  this.props.article.tags.map(tag => {
                    return (
                      <li
                        className="tag-default tag-pill tag-outline"
                        key={tag}>
                        {tag}
                      </li>
                    );
                  })
                }
              </ul>

            </div>
          </div>

          <hr />

          <div className="article-actions">
          </div>

          <div className="row">
            <CommentContainer
              comments={this.props.comments || []}
              errors={this.props.commentErrors}
              slug={this.props.match.params.id}
              currentUser={this.props.currentUser} />
          </div>
        </div>
      </div>
      
    );
    */
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Article);
