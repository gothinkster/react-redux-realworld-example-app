import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { favoriteArticle, unfavoriteArticle } from '../reducers/articleList';
import TagsList from '../features/tags/TagsList';

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

/**
 * Show a preview of an article
 *
 * @param {Object} props
 * @param {Object} props.article
 * @example
 * <ArticlePreview
 *    article={{
 *      slug: 'how-to-train-your-dragon',
 *      title: 'How to train your dragon',
 *      description: 'Ever wonder how?',
 *      body: 'It takes a Jacobian',
 *      tagList: ['dragons', 'training'],
 *      createdAt: '2016-02-18T03:22:56.637Z',
 *      updatedAt: '2016-02-18T03:48:35.824Z',
 *      favorited: false,
 *      favoritesCount: 0,
 *      author: {
 *        username: 'jake',
 *        bio: 'I work at statefarm',
 *        image: 'https://i.stack.imgur.com/xHWG8.jpg',
 *        following: false,
 *      },
 *    }}
 * />
 */
function ArticlePreview({ article }) {
  const dispatch = useDispatch();
  const favoriteButtonClass = article.favorited
    ? FAVORITED_CLASS
    : NOT_FAVORITED_CLASS;

  const handleClick = (event) => {
    event.preventDefault();

    if (article.favorited) {
      dispatch(unfavoriteArticle(article.slug));
    } else {
      dispatch(favoriteArticle(article.slug));
    }
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/@${article.author.username}`}>
          <img
            src={
              article.author.image ||
              'https://static.productionready.io/images/smiley-cyrus.jpg'
            }
            alt={article.author.username}
          />
        </Link>

        <div className="info">
          <Link className="author" to={`/@${article.author.username}`}>
            {article.author.username}
          </Link>
          <time className="date" dateTime={article.createdAt}>
            {new Date(article.createdAt).toDateString()}
          </time>
        </div>

        <div className="pull-xs-right">
          <button className={favoriteButtonClass} onClick={handleClick}>
            <i className="ion-heart" /> {article.favoritesCount}
          </button>
        </div>
      </div>

      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <TagsList tags={article.tagList} />
      </Link>
    </div>
  );
}

export default memo(ArticlePreview);
