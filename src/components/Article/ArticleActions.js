import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { memo } from 'react';
import { useDispatch } from 'react-redux';

import { deleteArticle } from '../../reducers/common';

/**
 * Show the actions to edit or delete an article
 *
 * @example
 * <ArticleActions />
 */
function ArticleActions() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * @type {React.MouseEventHandler}
   */
  const removeArticle = () => {
    dispatch(deleteArticle(slug));
    navigate('/');
  };

  return (
    <span>
      <Link to={`/editor/${slug}`} className="btn btn-outline-secondary btn-sm">
        <i className="ion-edit"></i> Edit Article
      </Link>

      <button className="btn btn-outline-danger btn-sm" onClick={removeArticle}>
        <i className="ion-trash-a"></i> Delete Article
      </button>
    </span>
  );
}

export default memo(ArticleActions);
