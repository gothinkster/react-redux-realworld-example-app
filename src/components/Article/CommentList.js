import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getCommentsForArticle,
  selectAllComments,
} from '../../features/comments/commentsSlice';
import Comment from './Comment';

/**
 * List all comments of an article
 *
 * @example
 * <CommentList />
 */
function CommentList() {
  const dispatch = useDispatch();
  const comments = useSelector(selectAllComments);
  const { slug } = useParams();

  useEffect(() => {
    const fetchComments = dispatch(getCommentsForArticle(slug));

    return () => {
      fetchComments.abort();
    };
  }, [slug]);

  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </>
  );
}

export default CommentList;
