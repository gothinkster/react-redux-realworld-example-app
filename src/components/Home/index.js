import React from 'react';
import { connect } from 'react-redux';

import Banner from './Banner';
import MainView from './MainView';
import Tags from './Tags';
import {
  getArticlesByTag,
  homePageLoaded,
  homePageUnloaded,
} from '../../reducers/articleList';

const mapStateToProps = state => ({
  tags: state.articleList.tags,
  appName: state.common.appName,
  token: state.common.token,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: tag => dispatch(getArticlesByTag({ tag })),
  onLoad: tab => dispatch(homePageLoaded(tab)),
  onUnload: () => dispatch(homePageUnloaded()),
});

class Home extends React.PureComponent {
  componentDidMount() {
    const tab = this.props.token ? 'feed' : 'all';

    this.props.onLoad(tab);
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
            <MainView />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags
                  tags={this.props.tags}
                  onClickTag={this.props.onClickTag} />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
