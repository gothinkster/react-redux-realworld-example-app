'use strict';

const ArticleList = require('./ArticleList');
const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

const Promise = global.Promise;

const Tags = props => {
  const tags = props.tags;
  if (tags) {
    return (
      <div className="tag-list">
        {
          tags.map(tag => {
            const handleClick = ev => {
              ev.preventDefault();
              store.dispatch({
                type: 'APPLY_TAG_FILTER',
                tag: tag,
                payload: agent.Articles.byTag(tag)
              });
            };

            return (
              <a
                href=""
                className="tag-default tag-pill"
                key={tag}
                onClick={handleClick}>
                {tag}
              </a>
            );
          })
        }
      </div>
    );
  } else {
    return (
      <div>Loading Tags...</div>
    );
  }
}

class Banner extends React.Component {
  render() {
    if (this.props.token) {
      return null;
    }
    return (
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">
            {this.props.appName.toLowerCase()}
          </h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
    );
  }
};

const YourFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      store.dispatch({
        type: 'CHANGE_TAB',
        tab: 'feed',
        payload: agent.Articles.feed()
      });
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
    store.dispatch({
      type: 'CHANGE_TAB',
      tab: 'all',
      payload: agent.Articles.all()
    });
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

const MainView = props => {
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">

          <YourFeedTab token={props.token} tab={props.tab} />

          <GlobalFeedTab tab={props.tab} />

          <TagFilterTab tag={props.tag} />

        </ul>
      </div>

      <ArticleList
        articles={props.articles}
        loading={props.loading}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

class Home extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    this.unsubscribe =
      store.subscribe(() => { this.setState(store.getState()) });
  }

  componentWillMount() {
    const tab = this.state.token ? 'feed' : 'all';
    const articlesPromise = this.state.token ?
      agent.Articles.feed() :
      agent.Articles.all();

    store.dispatch({
      type: 'HOME_PAGE_LOADED',
      tab,
      payload: Promise.all([agent.Tags.getAll(), articlesPromise])
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    store.dispatch({ type: 'HOME_PAGE_UNLOADED' });
  }

  render() {
    return (
      <div className="home-page">

        <Banner token={this.state.token} appName={this.state.appName} />

        <div className="container page">
          <div className="row">
            <MainView
              token={this.state.token}
              tab={this.state.tab}
              articles={this.state.articles}
              articlesCount={this.state.articlesCount}
              loading={this.state.loading}
              currentPage={this.state.currentPage}
              tag={this.state.tag} />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags tags={this.state.tags} />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

module.exports = Home;
