import Comment from './Comment';
import React from 'react';

const CommentList = ({ currentUser, comments, slug }) => {
  return (
    <div>
      {
        comments.map(comment => {
          return (
            <Comment
              comment={comment}
              currentUser={currentUser}
              slug={slug}
              key={comment.id} />
          );
        })
      }
    </div>
  );
};

export default CommentList;
