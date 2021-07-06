import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeTab, homePageUnloaded } from '../../reducers/articleList';
import Banner from './Banner';
import MainView from './MainView';
import Tags from './Tags';

/**
 * Home screen component
 *
 * @example
 * <Home />
 */
function Home() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.common.token);

  useEffect(() => {
    const defaultTab = token ? 'feed' : 'all';
    const fetchArticles = dispatch(changeTab(defaultTab));

    return () => {
      dispatch(homePageUnloaded());
      fetchArticles.abort();
    };
  }, []);

  return (
    <div className="home-page">
      <Banner />

      <div className="container page">
        <div className="row">
          <MainView />

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <Tags />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
