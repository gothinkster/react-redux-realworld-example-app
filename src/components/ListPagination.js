import React from 'react';
import { connect } from 'react-redux';

import { getAllArticles } from '../reducers/articleList';

const mapDispatchToProps = dispatch => ({
  onSetPage: page => dispatch(getAllArticles({ page })),
});

const ListPagination = React.memo(props => {
  if (props.articlesCount <= props.articlesPerPage) {
    return null;
  }

  const pages = Array.from(
    { length: Math.ceil(props.articlesCount / props.articlesPerPage) },
    (_, number) => number
  );

  return (
    <nav>
      <ul className="pagination">
        {pages.map(page => {
          const isCurrent = page === props.currentPage;
          const onClick = event => {
            event.preventDefault();
            props.onSetPage(page);
          };

          return (
            <li
              className={isCurrent ? 'page-item active' : 'page-item'}
              onClick={onClick}
              key={page.toString()}
            >
              <button type="button" className="page-link">
                {page + 1}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

export default connect(() => ({}), mapDispatchToProps)(ListPagination);
