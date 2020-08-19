import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import { SET_PAGE } from '../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onSetPage: (page, payload) =>
    dispatch({ type: SET_PAGE, page, payload })
});

const ListPagination = props => {
  if (props.articlesCount <= 10) {
    return null;
  }

  const PageCount = Math.ceil(props.articlesCount / 10);

  const currentPage = props.currentPage + 1; //since api has current page  from 0 to Pagecount
  const range = [];

  let index; //variable for pushing Page number in an array

  let PageListCount = 5; //we can modify according to the pagination list count we needed

  if (PageCount < PageListCount) {
    //incase we have number of pages less than the page list i.e., 3 pages at 5 pagination list
    PageListCount = PageCount;
  }

  if (currentPage <= Math.floor(PageListCount / 2)) {
    index = 1;
  }
  else if (currentPage >= PageCount - Math.floor(PageListCount / 2)) {
    index = PageListCount % 2 === 0 ? PageCount - Math.floor(PageListCount / 2) * 2 + 1 : PageCount - Math.floor(PageListCount / 2) * 2;
    //to maintain the current page as center and to avoid the overflow of page number beyond the pagecount
  }
  else {
    index = currentPage - Math.floor(PageListCount / 2); //to maintain the current page as center 
  }

  for (let i = 1; i <= PageListCount; ++index, i++) {
    range.push(index);
  }


  const setPage = page => {
    if (props.pager) {
      props.onSetPage(page, props.pager(page));
    } else {
      props.onSetPage(page, agent.Articles.all(page))
    }
  };

  const onClick = (ev, v) => {
    ev.preventDefault();

    if (props.currentPage === v - 1) {
      //if same page we stop processing the next request
      return null;
    }

    if (v > 0 && v <= PageCount) {
      setPage(v - 1);
    }

  };

  return (
    <nav>
      <ul className="pagination">

        <li
          className={'page-item'}
          onClick={(ev) => onClick(ev, 1)}
          key={"first"}>
          <a className="page-link" href="">First</a>
        </li>

        <li
          className={'page-item'}
          onClick={(ev) => onClick(ev, currentPage - 1)}
          key={"previous"}>
          <a className="page-link" href="">Previous</a>
        </li>

        {

          range.map(v => {
            const isCurrent = v === currentPage;
            return (
              <li
                className={isCurrent ? 'page-item active' : 'page-item'}
                onClick={(ev) => onClick(ev, v)}
                key={v.toString()}>
                <a className="page-link" href="">{v}</a>
              </li>
            );
          })
        }

        <li
          className={'page-item'}
          onClick={(ev) => onClick(ev, currentPage + 1)}
          key={"next"}>
          <a className="page-link" href="">Next</a>
        </li>
        <li
          className={'page-item'}
          onClick={(ev) => onClick(ev, PageCount)}
          key={"last"}>
          <a className="page-link" href="">Last</a>
        </li>
      </ul>
    </nav>
  );
};

export default connect(() => ({}), mapDispatchToProps)(ListPagination);
