import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import ListErrors from './ListErrors'
import {
  getArticle,
  createArticle,
  updateArticle,
  articlePageUnloaded
} from '../reducers/article'

const mapStateToProps = state => ({
  articleSlug: state.article.article?.slug,
  title: state.article.article?.title,
  description: state.article.article?.description,
  body: state.article.article?.body,
  tagList: state.article.article?.tagList,
  inProgress: state.article.inProgress,
  errors: state.article.errors
})

const mapDispatchToProps = dispatch => ({
  onLoad: slug => dispatch(getArticle(slug)),
  onSubmit: (articleSlug, article) =>
    dispatch(articleSlug ? updateArticle(article) : createArticle(article)),
  onUnload: () => dispatch(articlePageUnloaded())
})

function Editor (props) {
  const [state, setState] = useState({
    articleSlug: props.articleSlug,
    title: props.title ?? '',
    description: props.description ?? '',
    body: props.body ?? '',
    tagInput: '',
    tagList: props.tagList ?? []
  })

  const updateFieldEvent = key => event =>
    setState(prevState => ({
      ...prevState,
      [key]: event.target.value
    }))

  const watchForEnter = event => {
    if (event.keyCode === 13) {
      event.preventDefault()

      setState(prevState => ({
        ...prevState,
        tagList: [...prevState.tagList, prevState.tagInput],
        tagInput: ''
      }))
    }
  }

  const removeTagHandler = tag => () => {
    setState(prevState => ({
      ...prevState,
      tagList: prevState.tagList.filter(_tag => _tag !== tag)
    }))
  }

  const submitForm = event => {
    event.preventDefault()
    const { tagInput, articleSlug, ...article } = state

    props.onSubmit(articleSlug, article)
  }

  useEffect(() => {
    if (props.match.params.slug) {
      props.onUnload()
      props.onLoad(props.match.params.slug)
    }
    props.onLoad(null)
    return () => {
      props.onUnload()
    }
  }, [props.match])

  return (
    <div className='editor-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-10 offset-md-1 col-xs-12'>
            <ListErrors errors={props.errors} />

            <form>
              <fieldset>
                <fieldset className='form-group'>
                  <input
                    className='form-control form-control-lg'
                    type='text'
                    placeholder='Article Title'
                    value={state.title}
                    onChange={updateFieldEvent('title')}
                  />
                </fieldset>

                <fieldset className='form-group'>
                  <input
                    className='form-control'
                    type='text'
                    placeholder="What's this article about?"
                    value={state.description}
                    onChange={updateFieldEvent('description')}
                  />
                </fieldset>

                <fieldset className='form-group'>
                  <textarea
                    className='form-control'
                    rows='8'
                    placeholder='Write your article (in markdown)'
                    value={state.body}
                    onChange={updateFieldEvent('body')}
                  />
                </fieldset>

                <fieldset className='form-group'>
                  <input
                    className='form-control'
                    type='text'
                    placeholder='Enter tags'
                    value={state.tagInput}
                    onChange={updateFieldEvent('tagInput')}
                    onKeyUp={watchForEnter}
                  />

                  <div className='tag-list'>
                    {state.tagList.map(tag => {
                      return (
                        <span className='tag-default tag-pill' key={tag}>
                          <i
                            className='ion-close-round'
                            onClick={removeTagHandler(tag)}
                          />
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                </fieldset>

                <button
                  className='btn btn-lg pull-xs-right btn-primary'
                  type='button'
                  disabled={props.inProgress}
                  onClick={submitForm}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
