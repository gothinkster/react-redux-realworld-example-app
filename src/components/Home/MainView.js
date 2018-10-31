import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArticleList from "../ArticleList";
import TypeFilter from "./typeFilter";
import { fetchArticles } from "../../services/article";
import Filters from "./filters";
import SearchBar from "./searchBar";
import { LOAD } from "../../constants/actionTypes";

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.articleList.tags,
  typeFilter: state.articleList.typeFilter,
  token: state.common.token,
  articles: state.articleList.articles
});

const mapDispatchToProps = dispatch => ({
  load: payload => dispatch({ type: LOAD, payload })
});

class MainView extends React.Component {
  constructor() {
    super();

    this.filterArticlesByTag = this.filterArticlesByTag.bind(this);
    this.filterByType = this.filterByType.bind(this);
  }

  componentDidMount() {
    this.getAllArticles();
  }

  getAllArticles() {
    fetchArticles().then(result => {
      const { articles } = result;
      if (result) {
        this.props.load(articles);
      }
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
    return this.filterByType(this.filterArticlesByTag(articles));
  }

  render() {
    const { pager, currentPage } = this.props;
    return (
      <div className="col-md-12">
        <TypeFilter />
        <SearchBar />
        <Filters />
        <ArticleList
          pager={pager}
          articles={this.filterArticles()}
          currentPage={currentPage}
        />
      </div>
    );
  }
}

MainView.propTypes = {
  articles: PropTypes.array,
  token: PropTypes.string,
  tags: PropTypes.array,
  pager: PropTypes.func,
  currentPage: PropTypes.number,
  typeFilter: PropTypes.string,
  load: PropTypes.func
};

MainView.defaultProps = {
  tags: [],
  articles: []
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView);
