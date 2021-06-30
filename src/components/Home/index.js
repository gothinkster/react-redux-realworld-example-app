import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Banner from './Banner'
import MainView from './MainView'
import Tags from './Tags'
import { homePageLoaded, homePageUnloaded, getArticlesByTag } from '../../reducers/articleList'

const mapStateToProps = state => ({
  tags: state.articleList.tags,
  appName: state.common.appName,
  token: state.common.token
})

const mapDispatchToProps = dispatch => ({
  onClickTag: tag => dispatch(getArticlesByTag({ tag })),
  onLoad: tab => dispatch(homePageLoaded(tab)),
  onUnload: () => dispatch(homePageUnloaded())
})

function Home (props) {
  useEffect(() => {
    const tab = props.token ? 'feed' : 'all'

    props.onLoad(tab)

    return () => {
      props.onUnload()
    }
  }, [])

  return (
    <div className='home-page'>

      <Banner token={props.token} appName={props.appName} />

      <div className='container page'>
        <div className='row'>
          <MainView />

          <div className='col-md-3'>
            <div className='sidebar'>

              <p>Popular Tags</p>

              <Tags
                tags={props.tags}
                onClickTag={props.onClickTag}
              />

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
