import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ArticleList from '../ArticleList';
import { changeTab } from '../../reducers/articleList';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

/**
 * Your feed tab
 *
 * @example
 * <YourFeedTab />
 */
function YourFeedTab() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentTab = useSelector((state) => state.articleList.tab);
  const isActiveTab = currentTab === 'feed';

  if (!isAuthenticated) {
    return null;
  }

  const dispatchChangeTab = () => {
    dispatch(changeTab('feed'));
  };

  return (
    <li className="nav-item">
      <button
        type="button"
        className={isActiveTab ? 'nav-link active' : 'nav-link'}
        onClick={dispatchChangeTab}
      >
        Your Feed
      </button>
    </li>
  );
}

/**
 * Global feed tab
 *
 * @example
 * <GlobalFeedTab />
 */
function GlobalFeedTab() {
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.articleList.tab);
  const isActiveTab = currentTab === 'all';

  /**
   * Change to all tab
   * @type{React.MouseEventHandler}
   */
  const dispatchChangeTab = () => {
    dispatch(changeTab('all'));
  };

  return (
    <li className="nav-item">
      <button
        type="button"
        className={isActiveTab ? 'nav-link active' : 'nav-link'}
        onClick={dispatchChangeTab}
      >
        Global Feed
      </button>
    </li>
  );
}

/**
 * Tag tab
 *
 * @example
 * <TagFilterTab />
 */
function TagFilterTab() {
  const tag = useSelector((state) => state.articleList.tag);

  if (!tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <button type="button" className="nav-link active">
        <i className="ion-pound" /> {tag}
      </button>
    </li>
  );
}

/**
 * Show the tab navigation and the list of articles
 *
 * @example
 * <MainView />
 */
function MainView() {
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">
          <YourFeedTab />

          <GlobalFeedTab />

          <TagFilterTab />
        </ul>
      </div>

      <ArticleList />
    </div>
  );
}

export default memo(MainView);
