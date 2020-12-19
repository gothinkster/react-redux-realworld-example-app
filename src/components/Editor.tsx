import ListErrors from "./ListErrors"
import React from "react"
import agent from "../agent"
import { connect } from "react-redux"
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR,
} from "../constants/actionTypes"

const mapStateToProps = (state: { editor: any }) => ({
  ...state.editor,
})

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; payload?: any; tag?: string; key?: any; value?: any }) => any,
) => ({
  onAddTag: () => dispatch({ type: ADD_TAG }),
  onLoad: (payload: any) => dispatch({ type: EDITOR_PAGE_LOADED, payload }),
  onRemoveTag: (tag: any) => dispatch({ type: REMOVE_TAG, tag }),
  onSubmit: (payload: any) => dispatch({ type: ARTICLE_SUBMITTED, payload }),
  onUnload: (payload: any) => dispatch({ type: EDITOR_PAGE_UNLOADED }),
  onUpdateField: (key: any, value: any) => dispatch({ type: UPDATE_FIELD_EDITOR, key, value }),
})

class Editor extends React.Component<any> {
  changeTitle: (ev: { target: { value: any } }) => any
  changeDescription: (ev: { target: { value: any } }) => any
  changeBody: (ev: { target: { value: any } }) => any
  changeTagInput: (ev: { target: { value: any } }) => any
  watchForEnter: (ev: { keyCode: number; preventDefault: () => void }) => void
  removeTagHandler: (tag: string) => () => void
  submitForm: (ev: { preventDefault: () => void }) => void
  constructor(props?: any) {
    super(props)

    const updateFieldEvent = (key: string) => (ev: { target: { value: any } }) =>
      this.props.onUpdateField(key, ev.target.value)
    this.changeTitle = updateFieldEvent("title")
    this.changeDescription = updateFieldEvent("description")
    this.changeBody = updateFieldEvent("body")
    this.changeTagInput = updateFieldEvent("tagInput")

    this.watchForEnter = (ev: { keyCode: number; preventDefault: () => void }) => {
      if (ev.keyCode === 13) {
        ev.preventDefault()
        this.props.onAddTag()
      }
    }

    this.removeTagHandler = (tag: any) => () => {
      this.props.onRemoveTag(tag)
    }

    this.submitForm = (ev: { preventDefault: () => void }) => {
      ev.preventDefault()
      const article = {
        title: this.props.title,
        description: this.props.description,
        body: this.props.body,
        tagList: this.props.tagList,
      }

      const slug = { slug: this.props.articleSlug }
      const promise = this.props.articleSlug
        ? agent.Articles.update(Object.assign(article, slug))
        : agent.Articles.create(article)

      this.props.onSubmit(promise)
    }
  }

  componentWillReceiveProps(nextProps: { match: { params: { slug: any } } }) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      if (nextProps.match.params.slug) {
        this.props.onUnload()
        return this.props.onLoad(agent.Articles.get(this.props.match.params.slug))
      }
      this.props.onLoad(null)
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      return this.props.onLoad(agent.Articles.get(this.props.match.params.slug))
    }
    this.props.onLoad(null)
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Article Title"
                      value={this.props.title}
                      onChange={this.changeTitle}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      value={this.props.description}
                      onChange={this.changeDescription}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="Write your article (in markdown)"
                      value={this.props.body}
                      onChange={this.changeBody}
                    ></textarea>
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags"
                      value={this.props.tagInput}
                      onChange={this.changeTagInput}
                      onKeyUp={this.watchForEnter}
                    />

                    <div className="tag-list">
                      {(this.props.tagList || []).map((tag: string) => {
                        return (
                          <span className="tag-default tag-pill" key={tag}>
                            <i className="ion-close-round" onClick={this.removeTagHandler(tag)}></i>
                            {tag}
                          </span>
                        )
                      })}
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={this.props.inProgress}
                    onClick={this.submitForm}
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
