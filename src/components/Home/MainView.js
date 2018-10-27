import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArticleList from "../ArticleList";
import { getArticleCount, fetchArticles } from "../../services/article";
import { Filters } from "./filters";
import SearchBar from "./searchBar";
import { LOAD } from "../../constants/actionTypes";

const mapStateToProps = state => ({
  ...state.articleList,
  articles: state.articleList.articles
});

const mapDispatchToProps = dispatch => ({
  load: payload => dispatch({ type: LOAD, payload })
});

class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      articlesCount: 0,
      articles: []
    };
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

  render() {
    const { articles } = this.props;
    const { articlesCount } = this.state;
    return (
      <div className="col-md-12">
        <SearchBar />
        <Filters />
        <ArticleList articles={articles} articlesCount={articlesCount} />
      </div>
    );
  }
}

MainView.propTypes = {
  articles: PropTypes.array,
  token: PropTypes.string,
  tag: PropTypes.string,
  load: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView);
