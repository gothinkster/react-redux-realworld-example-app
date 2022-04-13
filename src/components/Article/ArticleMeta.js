import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../../features/auth/authSlice';

import ArticleActions from './ArticleActions';

/**
 * Show information about the current article
 *
 * @example
 * <ArticleMeta />
 */
function ArticleMeta() {
  const currentUser = useSelector(selectUser);
  const article = useSelector((state) => state.article.article);
  const isAuthor = currentUser?.username === article?.author.username;

  if (!article) return null;

  return (
    <div className="article-meta">
      <Link to={`/@${article.author.username}`}>
        <img
          src={
            article.author.image ??
            'https://static.productionready.io/images/smiley-cyrus.jpg'
          }
          alt={article.author.username}
        />
      </Link>

      <div className="info">
        <Link to={`/@${article.author.username}`} className="author">
          {article.author.username}
        </Link>

        <time className="date" dateTime={article.createdAt}>
          {new Date(article.createdAt).toDateString()}
        </time>
      </div>

      {isAuthor ? <ArticleActions /> : null}
    </div>
  );
}

export default memo(ArticleMeta);
