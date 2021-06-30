import React from 'react';
import { connect } from 'react-redux';

import ArticleList from '../ArticleList';
import { changeTab } from '../../reducers/articleList';

const YourFeedTab = React.memo(props => {
  if (!props.token) return null;

  const clickHandler = event => {
    event.preventDefault();
    props.onTabClick('feed');
  };

    return (
      <li className='nav-item'>
        <button
          type='button'
          className={props.tab === 'feed' ? 'nav-link active' : 'nav-link'}
          onClick={clickHandler}
        >
          Your Feed
        </button>
      </li>
    )
})

const GlobalFeedTab = React.memo(props => {
  const clickHandler = event => {
    event.preventDefault();
    props.onTabClick('all');
  };

  return (
    <li className='nav-item'>
      <button
        type='button'
        className={props.tab === 'all' ? 'nav-link active' : 'nav-link'}
        onClick={clickHandler}
      >
        Global Feed
      </button>
    </li>
  )
})

const TagFilterTab = React.memo(props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className='nav-item'>
      <button type='button' className='nav-link active'>
        <i className='ion-pound' /> {props.tag}
      </button>
    </li>
  )
})

const mapStateToProps = state => ({
  ...state.articleList,
  token: state.common.token,
});

const mapDispatchToProps = dispatch => ({
  onTabClick: tab => dispatch(changeTab(tab)),
});

const MainView = React.memo(props => {
  return (
    <div className='col-md-9'>
      <div className='feed-toggle'>
        <ul className='nav nav-pills outline-active'>

          <YourFeedTab
            token={props.token}
            tab={props.tab}
            onTabClick={props.onTabClick}
          />

          <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} />

          <TagFilterTab tag={props.tag} />

        </ul>
      </div>

      <ArticleList
        articles={props.articles}
        loading={props.loading}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage}
        articlesPerPage={props.articlesPerPage}
      />
    </div>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(MainView))
