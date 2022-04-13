import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import ListErrors from '../../components/ListErrors';
import { selectIsAuthenticated, selectUser } from '../auth/authSlice';
import CommentList from './CommentList';
import { createComment, selectErrors } from './commentsSlice';

/**
 * Add comment
 *
 * @example
 * <CommentForm />
 */
function CommentForm() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const { slug } = useParams();
  const [body, setBody] = useState('');

  /**
   * @type {React.ChangeEventHandler<HTMLTextAreaElement>}
   */
  const changeBody = (event) => {
    setBody(event.target.value);
  };

  /**
   * @type {React.FormEventHandler<HTMLFormElement>}
   */
  const saveComment = (event) => {
    event.preventDefault();
    dispatch(createComment({ articleSlug: slug, comment: { body } }));
    setBody('');
  };

  return (
    <form className="card comment-form" onSubmit={saveComment}>
      <div className="card-block">
        <textarea
          className="form-control"
          placeholder="Write a comment..."
          rows={3}
          value={body}
          onChange={changeBody}
        />
      </div>

      <div className="card-footer">
        <img
          className="comment-author-img"
          alt={currentUser.username}
          src={
            currentUser.image ??
            'https://static.productionready.io/images/smiley-cyrus.jpg'
          }
        />
        <button className="btn btn-sm btn-primary" type="submit">
          Post Comment
        </button>
      </div>
    </form>
  );
}

/**
 * Comments for an article
 *
 * @example
 * <CommentSection />
 */
function CommentSection() {
  const isAuthenticaded = useSelector(selectIsAuthenticated);
  const errors = useSelector(selectErrors);

  return (
    <div className="row">
      {isAuthenticaded ? (
        <div className="col-xs-12 col-md-8 offset-md-2">
          <ListErrors errors={errors} />

          <CommentForm />

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

export default memo(CommentSection);
