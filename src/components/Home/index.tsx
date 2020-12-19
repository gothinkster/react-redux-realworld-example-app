import Banner from "./Banner"
import MainView from "./MainView"
import React from "react"
import Tags from "./Tags"
import agent from "../../agent"
import { connect } from "react-redux"
import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED, APPLY_TAG_FILTER } from "../../constants/actionTypes"

const Promise = global.Promise

const mapStateToProps = (state: { home: any; common: { appName: string; token: string } }) => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
})

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; tag?: any; pager?: any; payload?: any; tab?: any }) => any,
) => ({
  onClickTag: (tag: any, pager: any, payload: any) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (tab: any, pager: any, payload: any) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () => dispatch({ type: HOME_PAGE_UNLOADED }),
})

class Home extends React.Component<any, any> {
  componentWillMount() {
    const tab = this.props.token ? "feed" : "all"
    const articlesPromise = this.props.token ? agent.Articles.feed : agent.Articles.all

    this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), articlesPromise()]))
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    return (
      <div className="home-page">
        <Banner token={this.props.token} appName={this.props.appName} />

        <div className="container page">
          <div className="row">
            <MainView />

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <Tags tags={this.props.tags} onClickTag={this.props.onClickTag} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
