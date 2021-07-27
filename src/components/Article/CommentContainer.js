import { Link } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';

import CommentInput from './CommentInput';
import CommentList from './CommentList';
import ListErrors from '../ListErrors';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { selectErrors } from '../../features/comments/commentsSlice';

/**
 * Comments for an article
 *
 * @example
 * <CommentContainer />
 */
function CommentContainer() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const commentErrors = useSelector(selectErrors);

  return (
    <div className="row">
      {isAuthenticated ? (
        <div className="col-xs-12 col-md-8 offset-md-2">
          <ListErrors errors={commentErrors} />

          <CommentInput />

          <CommentList />
        </div>
      ) : (
        <div className="col-xs-12 col-md-8 offset-md-2">
          <p>
            <Link to="/login">Sign in</Link>
            &nbsp;or&nbsp;
            <Link to="/register">sign up</Link>
            &nbsp;to add comments on this article.
          </p>

          <CommentList />
        </div>
      )}
    </div>
  );
}

export default CommentContainer;
