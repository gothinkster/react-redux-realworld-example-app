import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArticleList from "../ArticleList";
import { getArticleCount, fetchArticles } from "../../services/article";
import { CHANGE_TAB, LOAD } from "../../constants/actionTypes";
import Filters from "./filters";
import SearchBar from "./searchBar";

const mapStateToProps = state => ({
  ...state.articleList,
  token: state.common.token,
  articles: state.articleList.articles,
  tags: state.articleList.tags
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) =>
    dispatch({ type: CHANGE_TAB, tab, pager, payload }),
  load: articles => dispatch({ type: LOAD, payload: articles })
});

class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      articlesCount: 0,
      articles: []
    };

    this.filterArticles = this.filterArticles.bind(this);
  }

  componentDidMount() {
    const { currentPage } = this.props;
    const getCount = new Promise(resolve => {
      resolve(getArticleCount());
    });

    const getArticles = new Promise(resolve => {
      resolve(fetchArticles(currentPage));
    });

    getCount.then(result => {
      this.setState({ articlesCount: result.count });
    });

    getArticles.then(result => {
      const { articles } = result;
      this.props.load(articles);
    });
  }

  filterArticles() {
    const { articles, tags } = this.props;

    if (articles !== undefined && tags !== undefined) {
      return articles.filter(article => {
        for (var filterTag of tags) {
          if (filterTag.selected) {
            for (var tag of article.tags) {
            }
          }
          console.log(filterTag);
          return article;
        }
      });

      /*
      return articles.filter((article) => {        
          for (var filterTag of tags) {
            for (var articleTag of article.tags) {
              if (filterTag === articleTag) {
                return article;
              }
            }
          }
        }
      )
          */
    } else {
      return [];
    }
  }

  render() {
    const { articlesCount } = this.state;
    return (
      <div className="col-md-12">
        <SearchBar />
        <Filters />
        <ArticleList
          articles={this.filterArticles()}
          articlesCount={articlesCount}
        />
      </div>
    );
  }
}

MainView.propTypes = {
  articles: PropTypes.array,
  token: PropTypes.string,
  tab: PropTypes.string,
  onTabClick: PropTypes.func.isRequired,
  tag: PropTypes.string,
  pager: PropTypes.func,
  currentPage: PropTypes.number,
  tags: PropTypes.array
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView);
