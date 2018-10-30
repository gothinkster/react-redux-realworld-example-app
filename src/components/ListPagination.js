import React from "react";
import agent from "../agent";
import { connect } from "react-redux";
import { SET_PAGE } from "../constants/actionTypes";

const mapDispatchToProps = dispatch => ({
  onSetPage: payload => dispatch({ type: SET_PAGE, payload })
});

const ListPagination = props => {
  const { articlesCount, onSetPage, pager, currentPage, articles } = props;
  if (articlesCount <= 5) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(props.articlesCount / 5); ++i) {
    range.push(i);
  }

  const setPage = page => {
    onSetPage(page);
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
