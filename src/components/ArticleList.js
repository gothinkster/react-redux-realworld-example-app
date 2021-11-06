import ArticlePreview from './ArticlePreview';
import ListPagination from './ListPagination';
import { connect } from 'react-redux'
import React from 'react';
import Loader from './Loader';

function ArticleList(props) {
  const { setLoading, loading } = props;

  loading ? setLoading(true) : setLoading(false)

  if (!props.articles) return (<div></div>)

  if (props.articles.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }

  return (
    <div>
      {
        props.articles.map(article => {
          return (
            <ArticlePreview article={article} key={article.slug} />
          );
        })
      }

      <ListPagination
        pager={props.pager}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.articleList.loading
})


export default connect(mapStateToProps)(Loader(ArticleList));
