import ArticleList from "../ArticleList"
import React from "react"
import agent from "../../agent"
import { connect } from "react-redux"
import { CHANGE_TAB } from "../../constants/actionTypes"

const YourFeedTab = (props: {
  token: any
  onTabClick: (arg0: string, arg1: () => Promise<any>, arg2: Promise<any>) => void
  tab: string
}) => {
  if (props.token) {
    const clickHandler = (ev: { preventDefault: () => void }) => {
      ev.preventDefault()
      props.onTabClick("feed", agent.Articles.feed, agent.Articles.feed())
    }

    return (
      <li className="nav-item">
        <a
          href=""
          className={props.tab === "feed" ? "nav-link active" : "nav-link"}
          onClick={clickHandler}
        >
          Your Feed
        </a>
      </li>
    )
  }
  return null
}

const GlobalFeedTab = (props: {
  onTabClick: (arg0: string, arg1: (page?: number) => Promise<any>, arg2: Promise<any>) => void
  tab: string
}) => {
  const clickHandler = (ev: { preventDefault: () => void }) => {
    ev.preventDefault()
    props.onTabClick("all", agent.Articles.all, agent.Articles.all())
  }
  return (
    <li className="nav-item">
      <a
        href=""
        className={props.tab === "all" ? "nav-link active" : "nav-link"}
        onClick={clickHandler}
      >
        Global Feed
      </a>
    </li>
  )
}

const TagFilterTab = (props: { tag: React.ReactNode }) => {
  if (!props.tag) {
    return null
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound"></i> {props.tag}
      </a>
    </li>
  )
}

const mapStateToProps = (state: {
  articleList: any[]
  home: { tags: string[] }
  common: { token: string }
}) => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token,
})

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; tab: any; pager: any; payload: any }) => any,
) => ({
  onTabClick: (tab: any, pager: any, payload: any) =>
    dispatch({ type: CHANGE_TAB, tab, pager, payload }),
})

const MainView = (props: {
  token?: string
  tab?: any
  onTabClick?: any
  tag?: string
  pager?: any
  articles?: any[]
  loading?: any
  articlesCount?: number
  currentPage?: any
}) => {
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">
          <YourFeedTab token={props.token} tab={props.tab} onTabClick={props.onTabClick} />

          <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} />

          <TagFilterTab tag={props.tag} />
        </ul>
      </div>

      <ArticleList
        pager={props.pager}
        articles={props.articles}
        loading={props.loading}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage}
      />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView)
