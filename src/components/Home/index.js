import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';

const Promise = global.Promise;

const mapStateToProps = state => ({
  appName: state.appName,
  articles: state.articles,
  articlesCount: state.articlesCount,
  currentPage: state.currentPage,
  loading: state.loading,
  tab: state.tab,
  tag: state.tag,
  token: state.token
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, payload) =>
    dispatch({ type: 'HOME_PAGE_LOADED', tab, payload }),
  onUnload: () =>
    dispatch({  type: 'HOME_PAGE_UNLOADED' })
})

class Home extends React.Component {
  componentWillMount() {
    const tab = this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ?
      agent.Articles.feed() :
      agent.Articles.all();

    this.props.onLoad(tab, Promise.all([agent.Tags.getAll(), articlesPromise]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">

        <Banner token={this.props.token} appName={this.props.appName} />

        <div className="container page">
          <div className="row">
            <MainView
              token={this.props.token}
              tab={this.props.tab}
              articles={this.props.articles}
              articlesCount={this.props.articlesCount}
              loading={this.props.loading}
              currentPage={this.props.currentPage}
              tag={this.props.tag} />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags tags={this.props.tags} />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Home);
