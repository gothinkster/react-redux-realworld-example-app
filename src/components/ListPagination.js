import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllArticles } from '../reducers/articleList';

/**
 * Show a list with the available pages
 *
 * @example
 * <ListPagination />
 */
function ListPagination() {
  const dispatch = useDispatch();
  const articlesCount = useSelector((state) => state.articleList.articlesCount);
  const currentPage = useSelector((state) => state.articleList.currentPage);
  const articlesPerPage = useSelector(
    (state) => state.articleList.articlesPerPage
  );

  if (articlesCount <= articlesPerPage) {
    return null;
  }

  const pages = Array.from(
    { length: Math.ceil(articlesCount / articlesPerPage) },
    (_, number) => number
  );

  const handleClickPage = (page) => () => {
    dispatch(getAllArticles({ page }));
  };

  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => {
          const isActivePage = page === currentPage;

          return (
            <li
              className={isActivePage ? 'page-item active' : 'page-item'}
              onClick={handleClickPage(page)}
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
}

export default memo(ListPagination);
