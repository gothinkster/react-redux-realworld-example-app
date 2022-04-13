import React, { lazy, memo, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import snarkdown from 'snarkdown';
import xss from 'xss';

import TagsList from '../../features/tags/TagsList';
import { articlePageUnloaded, getArticle } from '../../reducers/article';
import ArticleMeta from './ArticleMeta';

const CommentSection = lazy(() =>
  import(
    /* webpackChunkName: "CommentSection", webpackPrefetch: true  */ '../../features/comments/CommentSection'
  )
);

/**
 * Show one article with its comments
 *
 * @param {import('react-router-dom').RouteComponentProps<{ slug: string }>} props
 * @example
 * <Article />
 */
function Article({ match }) {
  const dispatch = useDispatch();
  const article = useSelector((state) => state.article.article);
  const inProgress = useSelector((state) => state.article.inProgress);
  const { slug } = useParams();
  const renderMarkdown = () => ({ __html: xss(snarkdown(article.body)) });

  useEffect(() => {
    const fetchArticle = dispatch(getArticle(slug));
    return () => {
      fetchArticle.abort();
    };
  }, [match]);

  useEffect(() => () => dispatch(articlePageUnloaded()), []);

  if (!article) {
    return (
      <div className="article-page">
        <div className="container page">
          <div className="row article-content">
            <div className="col-xs-12">
              {inProgress && <h1 role="alert">Article is loading</h1>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-xs-12">
            <article dangerouslySetInnerHTML={renderMarkdown()} />

            <TagsList tags={article.tagList} />
          </div>
        </div>

        <hr />

        <Suspense fallback={<p>Loading comments</p>}>
          <CommentSection />
        </Suspense>
      </div>
    </div>
  );
}

export default memo(Article);
