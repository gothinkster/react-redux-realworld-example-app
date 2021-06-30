import { Link } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';

import { deleteArticle } from '../../reducers/common';

const mapDispatchToProps = dispatch => ({
  onClickDelete: slug => dispatch(deleteArticle(slug)),
});

const ArticleActions = props => {
  const article = props.article;

  if (!props.canModify) {
    return null;
  }

    return (
      <span>
        <Link
          to={`/editor/${article.slug}`}
        className="btn btn-outline-secondary btn-sm"
      >
          <i className="ion-edit"></i> Edit Article
        </Link>

      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => props.onClickDelete(article.slug)}
      >
          <i className="ion-trash-a"></i> Delete Article
        </button>
    </span>
  );
};

export default connect(() => ({}), mapDispatchToProps)(React.memo(ArticleActions))
