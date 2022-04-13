import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import {
  getCommentsForArticle,
  removeComment,
  selectAllComments,
  selectIsAuthor,
  selectIsLoading,
} from './commentsSlice';

/**
 * Delete a comment
 *
 * @param {object}  props
 * @param {number}  props.commentId
 * @example
 * <DeleteCommentButton commentId={1} />
 */
function DeleteCommentButton({ commentId }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const { slug } = useParams();

  /**
   * @type {React.MouseEventHandler<HTMLButtonElement>}
   */
  const deleteComment = () => {
    dispatch(removeComment({ articleSlug: slug, commentId }));
  };

  return (
    <button
      className="btn btn-sm btn-link mod-options"
      disabled={isLoading}
      onClick={deleteComment}
    >
      <i className="ion-trash-a" />
      <span className="sr-only">Delete comment</span>
    </button>
  );
}

/**
 *
 * @param {object} props
 * @param {import('../../agent').Comment} props.comment
 * @example
 * <Comment
 *    comment={{
 *      id: 1,
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
  const isAuthor = useSelector(selectIsAuthor(comment.id));

  return (
    <div className="card" data-testid="comment">
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
        {isAuthor ? <DeleteCommentButton commentId={comment.id} /> : null}
      </div>
    </div>
  );
}

/**
 * List all comments of an article
 *
 * @example
 * <CommentList />
 */
function CommentList() {
  const dispatch = useDispatch();
  const comments = useSelector(selectAllComments);
  const isLoading = useSelector(selectIsLoading);
  const { slug } = useParams();

  useEffect(() => {
    const fetchComments = dispatch(getCommentsForArticle(slug));

    return () => {
      fetchComments.abort();
    };
  }, [slug]);

  if (isLoading) {
    return <p>Loading comments</p>;
  }

  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </>
  );
}

export default memo(CommentList);
