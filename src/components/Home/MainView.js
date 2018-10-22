import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArticleList from "../ArticleList";
import agent from "../../agent";
import { getArticleCount, fetchArticles } from "../services/article";

import { CHANGE_TAB } from "../../constants/actionTypes";

const YourFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      props.onTabClick("feed", agent.Articles.feed, agent.Articles.feed());
    };

    return (
      <li className="nav-item">
        <a
          href=""
          className={props.tab === "feed" ? "nav-link active" : "nav-link"}
          onClick={event => clickHandler(event)}
        >
          Your Feed
        </a>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick("all", agent.Articles.all, agent.Articles.all());
  };
  return (
    <li className="nav-item">
      <a
        href=""
        className={props.tab === "all" ? "nav-link active" : "nav-link"}
        onClick={event => clickHandler(event)}
      >
        Global Feed
      </a>
    </li>
  );
};

const TagFilterTab = props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound" /> {props.tag}
      </a>
    </li>
  );
};

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
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

  render() {
    const { tag, pager, currentPage } = this.props;
    const { articles, articlesCount } = this.state;
    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">
            <TagFilterTab tag={tag} />
          </ul>
        </div>

        <ArticleList
          pager={pager}
          articles={articles}
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
  currentPage: PropTypes.number
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView);
