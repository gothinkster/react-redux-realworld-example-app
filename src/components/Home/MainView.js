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
  articles: state.articleList.articles || [],
  tags: state.articleList.tags || []
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

    this.filterArticlesByTag = this.filterArticlesByTag.bind(this);
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

  checkTags(article, tags) {
    for (let tag of tags) {
      for (let articleTag of article.tags) {
        if (tag.selected && tag.name === articleTag) {
          return true;
        }
      }
    }
    return false;
  }

  filterArticlesByTag() {
    const { articles, tags } = this.props;
    if (tags.length) {
      return articles.filter(article => {
        return this.checkTags(article, tags) === true;
      });
    } else {
      return articles;
    }
  }

  render() {
    const { articlesCount } = this.state;
    return (
      <div className="col-md-12">
        <SearchBar />
        <Filters />
        <ArticleList
          articles={this.filterArticlesByTag()}
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
