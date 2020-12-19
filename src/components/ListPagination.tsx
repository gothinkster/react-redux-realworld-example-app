import agent from "../agent"
import { connect } from "react-redux"
import { SET_PAGE } from "../constants/actionTypes"

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; page: number; payload: any }) => any,
) => ({
  onSetPage: (page: number, payload: any) => dispatch({ type: SET_PAGE, page, payload }),
})

const ListPagination = (props: {
  articlesCount: number
  pager: (arg0: any) => any
  onSetPage: (arg0: any, arg1: Promise<any>) => void
  currentPage: number
}) => {
  if (props.articlesCount <= 10) {
    return null
  }

  const range: number[] = []
  for (let i = 0; i < Math.ceil(props.articlesCount / 10); ++i) {
    range.push(i)
  }

  const setPage = (page?: number) => {
    if (props.pager) {
      props.onSetPage(page, props.pager(page))
    } else {
      props.onSetPage(page, agent.Articles.all(page))
    }
  }

  return (
    <nav>
      <ul className="pagination">
        {range.map((v) => {
          const isCurrent = v === props.currentPage
          const onClick = (ev: { preventDefault: () => void }) => {
            ev.preventDefault()
            setPage(v)
          }
          return (
            <li
              className={isCurrent ? "page-item active" : "page-item"}
              onClick={onClick}
              key={v.toString()}
            >
              <a className="page-link" href="">
                {v + 1}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default connect(() => ({}), mapDispatchToProps)(ListPagination)
