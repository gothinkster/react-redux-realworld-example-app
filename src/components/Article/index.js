import ArticleMeta from './ArticleMeta';
import CommentContainer from './CommentContainer';
import React, {useEffect} from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import marked from 'marked';
import { ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED } from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.article,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: ARTICLE_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: ARTICLE_PAGE_UNLOADED })
});

const Article = (props) => {
  useEffect(() => {
    props.onLoad(Promise.all([
      agent.Articles.get(props.match.params.id),
      agent.Comments.forArticle(props.match.params.id)
    ]));
    return () => props.onUnload();
  }, []);

    if (!props.article) {
      return null;
    }

    const markup = { __html: marked(props.article.body, { sanitize: true }) };
    const canModify = props.currentUser &&
      props.currentUser.username === props.article.author.username;
    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{props.article.title}</h1>
            <ArticleMeta
              article={props.article}
              canModify={canModify} />

          </div>
        </div>

        <div className="container page">

          <div className="row article-content">
            <div className="col-xs-12">

              <div dangerouslySetInnerHTML={markup}></div>

              <ul className="tag-list">
                {
                  props.article.tagList.map(tag => {
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
              comments={props.comments || []}
              errors={props.commentErrors}
              slug={props.match.params.id}
              currentUser={props.currentUser} />
          </div>
        </div>
      </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
