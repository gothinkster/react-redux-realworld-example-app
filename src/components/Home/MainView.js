import ArticleList from "../ArticleList";
import React from "react";
import { connect } from "react-redux";
import { CHANGE_TAB } from "../../constants/actionTypes";
import { Filters } from "./filters";
import SearchBar from "./searchBar";

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) =>
    dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

const MainView = props => {
  return (
    <div className="col-md-9">
      <div className="row">
        <SearchBar />
      </div>
      <div className="row">
        <Filters />
      </div>
      <div className="row">
        <ArticleList
          pager={props.pager}
          articles={props.articles}
          loading={props.loading}
          articlesCount={props.articlesCount}
          currentPage={props.currentPage}
        />
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView);
