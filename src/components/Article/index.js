import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import snarkdown from 'snarkdown'
import xss from 'xss'

import ArticleMeta from './ArticleMeta'
import CommentContainer from './CommentContainer'
import { articlePageLoaded, articlePageUnloaded } from '../../reducers/article'

const mapStateToProps = state => ({
  ...state.article,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  onLoad: slug => dispatch(articlePageLoaded(slug)),
  onUnload: () => dispatch(articlePageUnloaded())
})

function Article (props) {
  useEffect(() => {
    props.onLoad(props.match.params.id)
    return () => {
      props.onUnload()
    }
  }, [])

  if (!props.article) {
    return null
  }

  const markup = { __html: xss(snarkdown(props.article.body)) }
  const canModify = props.currentUser &&
      props.currentUser.username === props.article.author.username
  return (
    <div className='article-page'>

      <div className='banner'>
        <div className='container'>

          <h1>{props.article.title}</h1>
          <ArticleMeta
            article={props.article}
            canModify={canModify}
          />

        </div>
      </div>

      <div className='container page'>

        <div className='row article-content'>
          <div className='col-xs-12'>

            <div dangerouslySetInnerHTML={markup} />

            <ul className='tag-list'>
              {
                  props.article.tagList.map(tag => {
                    return (
                      <li
                        className='tag-default tag-pill tag-outline'
                        key={tag}
                      >
                        {tag}
                      </li>
                    )
                  })
                }
            </ul>

          </div>
        </div>

        <hr />

        <div className='article-actions' />

        <div className='row'>
          <CommentContainer
            comments={props.comments || []}
            errors={props.commentErrors}
            slug={props.match.params.id}
            currentUser={props.currentUser}
          />
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Article)
