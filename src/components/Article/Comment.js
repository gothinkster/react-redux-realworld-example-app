import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectUser } from '../../features/auth/authSlice';
import DeleteButton from './DeleteButton';

/**
 *
 * @param {Object} props
 * @param {Object} props.comment
 * @example
 * <Comment
 *    comment={{
 *      id: "1",
 *      createdAt: "2016-02-18T03:22:56.637Z",
 *      updatedAt: "2016-02-18T03:22:56.637Z",
 *      body: "It takes a Jacobian",
 *      author: {
 *        username: "jake",
 *        bio: "I work at statefarm",
 *        image: "https://i.stack.imgur.com/xHWG8.jpg",
 *        following: false,
 *      },
 *    }}
 * />
 */
function Comment({ comment }) {
  const currentUser = useSelector(selectUser);
  const isAuthor = currentUser?.username === comment.author.username;

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>

      <div className="card-footer">
        <Link to={`/@${comment.author.username}`} className="comment-author">
          <img
            className="comment-author-img"
            alt={comment.author.username}
            src={
              comment.author.image ??
              'https://static.productionready.io/images/smiley-cyrus.jpg'
            }
          />
        </Link>
        &nbsp;
        <Link to={`/@${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <time className="date-posted" dateTime={comment.createdAt}>
          {new Date(comment.createdAt).toDateString()}
        </time>
        {isAuthor ? <DeleteButton commentId={comment.id} /> : null}
      </div>
    </div>
  );
}

export default Comment;
