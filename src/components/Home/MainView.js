import ArticleList from '../ArticleList';
import React from 'react';
import agent from '../../agent';
import { getArticleCount, fetchArticles } from "../services/article";
import { connect } from 'react-redux';
import { CHANGE_TAB } from '../../constants/actionTypes';

const YourFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      props.onTabClick('feed', agent.Articles.feed, agent.Articles.feed());
    }

    return (
      <li className="nav-item">
        <a  href=""
            className={ props.tab === 'feed' ? 'nav-link active' : 'nav-link' }
            onClick={clickHandler}>
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
    props.onTabClick('all', agent.Articles.all, agent.Articles.all());
  };
  return (
    <li className="nav-item">
      <a
        href=""
        className={ props.tab === 'all' ? 'nav-link active' : 'nav-link' }
        onClick={clickHandler}>
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
        <i className="ion-pound"></i> {props.tag}
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
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      articlesCount: 0,
      currentPage: 1,
      loading: true,
      articles: []
    };
  }

  componentDidMount() {
    const getCount = new Promise((resolve, reject) => { 
      resolve(getArticleCount());
    });


    getCount.then(result => {
      this.setState({articlesCount: result.count});
    });

    const getArticles = new Promise((resolve, reject) => { 
      resolve(fetchArticles(this.state.currentPage));
    });

    getArticles.then(result => {
      this.setState({articles: result.articles});
    });
  };
  

  render() { 
    console.log(this.state.articles);
    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">

            <YourFeedTab
              token={this.props.token}
              tab={this.props.tab}
              onTabClick={this.props.onTabClick} />

            <GlobalFeedTab tab={this.props.tab} onTabClick={this.props.onTabClick} />

            <TagFilterTab tag={this.props.tag} />

          </ul>
        </div>

        <ArticleList
          pager={this.props.pager}
          articles={this.state.articles}
          articlesCount={this.state.articlesCount}
          currentPage={this.state.currentPage} />
      </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
