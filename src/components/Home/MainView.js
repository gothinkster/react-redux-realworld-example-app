import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArticleList from "../ArticleList";
import TypeFilter from "./typeFilter";
import { getArticleCount, fetchArticles } from "../../services/article";
import Filters from "./filters";
import SearchBar from "./searchBar";
import { LOAD } from "../../constants/actionTypes";

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.articleList.tags || [],
  typeFilter: state.articleList.typeFilter,
  token: state.common.token,
  articles: state.articleList.articles || []
});

const mapDispatchToProps = dispatch => ({
  load: payload => dispatch({ type: LOAD, payload })
});

class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      articlesCount: 0
    };

    this.filterArticlesByTag = this.filterArticlesByTag.bind(this);
    this.filterByType = this.filterByType.bind(this);
  }

  componentDidMount() {
    const getCount = new Promise(resolve => {
      resolve(getArticleCount());
    });

    const getArticles = new Promise(resolve => {
      resolve(fetchArticles());
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

  filterArticlesByTag(articles) {
    const { tags } = this.props;
    if (tags.length) {
      return articles.filter(article => {
        return this.checkTags(article, tags) === true;
      });
    } else {
      return articles;
    }
  }

  filterByType(articles) {
    const { typeFilter } = this.props;

    if (typeFilter === "All") {
      return articles;
    }

    if (typeFilter === "Stack Overflow") {
      return articles.filter(article => {
        return article.type === "Stack Overflow Post";
      });
    }

    if (typeFilter === "Tutorial") {
      return articles.filter(article => {
        return article.type !== "Stack Overflow Post";
      });
    }
  }

  filterArticles() {
    const { articles } = this.props;
    return this.filterArticlesByTag(this.filterByType(articles));
  }

  render() {
    const { pager, currentPage } = this.props;
    const { articlesCount } = this.state;
    return (
      <div className="col-md-12">
        <TypeFilter />
        <SearchBar />
        <Filters />
        <ArticleList
          pager={pager}
          articles={this.filterArticles()}
          articlesCount={articlesCount}
          currentPage={currentPage}
        />
      </div>
    );
  }
}

MainView.propTypes = {
  articles: PropTypes.array,
  token: PropTypes.string,
  tag: PropTypes.string,
  pager: PropTypes.func,
  currentPage: PropTypes.number,
  typeFilter: PropTypes.string,
  load: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView);
