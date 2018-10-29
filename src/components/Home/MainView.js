import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArticleList from "../ArticleList";
import TypeFilter from "./typeFilter";
import { getArticleCount, fetchArticles } from "../../services/article";

import { CHANGE_TAB } from "../../constants/actionTypes";
import { Filters } from "./filters";

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
  typeFilter: state.articleList.typeFilter,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) =>
    dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      articlesCount: 0,
      articles: []
    };

    this.filterByType = this.filterByType.bind(this);
  }

  componentDidMount() {
    const { currentPage } = this.props;
    const getCount = new Promise(
      resolve => {
        resolve(getArticleCount());
      },
      reject => {
        console.log(reject);
      }
    );

    const getArticles = new Promise(
      resolve => {
        resolve(fetchArticles(currentPage));
      },
      reject => {
        console.log(reject);
      }
    );

    getCount.then(result => {
      this.setState({ articlesCount: result.count });
    });

    getArticles.then(result => {
      this.setState({ articles: result.articles });
    });
  }

  filterByType() {
    const { articles } = this.state;
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

  render() {
    const { tag, pager, currentPage } = this.props;
    const { articlesCount } = this.state;
    return (
      <div className="col-md-9">
        <TypeFilter />
        <Filters />
        <ArticleList
          pager={pager}
          articles={this.filterByType()}
          articlesCount={articlesCount}
          currentPage={currentPage}
        />
      </div>
    );
  }
}

MainView.propTypes = {
  token: PropTypes.string,
  tab: PropTypes.string,
  onTabClick: PropTypes.func.isRequired,
  tag: PropTypes.string,
  pager: PropTypes.func,
  currentPage: PropTypes.number,
  typeFilter: PropTypes.string
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView);
