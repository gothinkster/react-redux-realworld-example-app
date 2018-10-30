import React from "react";
import agent from "../agent";
import { connect } from "react-redux";
import { SET_PAGE } from "../constants/actionTypes";

const mapDispatchToProps = dispatch => ({
  onSetPage: (page, payload) => dispatch({ type: SET_PAGE, page, payload })
});

const ListPagination = props => {
  const { articlesCount, onSetPage, pager, currentPage } = props;
  if (articlesCount <= 10) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(props.articlesCount / 5); ++i) {
    range.push(i);
  }

  const setPage = page => {
    if (pager) {
      onSetPage(page, pager(page));
    } else {
      onSetPage(page, agent.Articles.all(page));
    }
  };

  return (
    <nav>
      <ul className="pagination">
        {range.map(v => {
          const isCurrent = v === currentPage;
          const onClick = ev => {
            ev.preventDefault();
            setPage(v);
          };
          return (
            <li
              className={isCurrent ? "page-item active" : "page-item"}
              onClick={event => onClick(event)}
              key={v.toString()}
            >
              <a className="page-link" href="">
                {v + 1}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default connect(
  () => ({}),
  mapDispatchToProps
)(ListPagination);
