import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArticleList from "../ArticleList";
import { getArticleCount, fetchArticles } from "../../services/article";
import { CHANGE_TAB, LOAD } from "../../constants/actionTypes";
import { Filters } from "./filters";
import SearchBar from "./searchBar";

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token,
  articles: state.articleList.articles
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
      const { articles } = result;
      console.log(result.articles);
      this.props.load(articles);
    });
  }

  render() {
    const { articles } = this.props;
    const { articlesCount } = this.state;
    return (
      <div className="col-md-9">
        <SearchBar />
        <Filters />
        <div className="row">
          <ArticleList articles={articles} articlesCount={articlesCount} />
        </div>
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
  currentPage: PropTypes.number
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView);
