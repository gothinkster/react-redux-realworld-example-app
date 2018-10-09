import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import SubmitArticle from "./services/article";
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.editor
});

const mapDispatchToProps = dispatch => ({
  onAddTag: () =>
    dispatch({ type: ADD_TAG }),
  onLoad: payload =>
    dispatch({ type: EDITOR_PAGE_LOADED, payload }),
  onRemoveTag: tag =>
    dispatch({ type: REMOVE_TAG, tag }),
  onSubmit: payload =>
    dispatch({ type: ARTICLE_SUBMITTED, payload }),
  onUnload: payload =>
    dispatch({ type: EDITOR_PAGE_UNLOADED }),
  onUpdateField: (key, value) =>
    dispatch({ type: UPDATE_FIELD_EDITOR, key, value })
});

class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      url: "",
      title: "",
      summary: "",
      tagInput: "",
      tags: []
    };    

    this.updateField = this.updateField.bind(this);
    this.watchForEnter = this.watchForEnter.bind(this);
    this.removeTagHandler = this.removeTagHandler.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      if (nextProps.match.params.slug) {
        this.props.onUnload();
        return this.props.onLoad(agent.Articles.get(this.props.match.params.slug));
      }
      this.props.onLoad(null);
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      return this.props.onLoad(agent.Articles.get(this.props.match.params.slug));
    }
    this.props.onLoad(null);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  updateField(event) {
    this.setState({[event.target.name]: event.target.value});
  }  

  watchForEnter(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this.setState(prevState => ({tags: [...prevState.tags, prevState.tagInput], tagInput: ""}));
    }
  };

  removeTagHandler(event, index) {
    let splicedTags = this.state.tags;
    splicedTags.splice(index, 1);
    this.setState({tags: splicedTags});
  };

  submitForm(event) {
    const {url, title, summary, tags} = this.state;
    event.preventDefault();

    const article = {
      url,
      title,
      summary,
      tags
    };    
  };

  render() {
    const {url, title, summary, tagInput, tags} = this.state;
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="urlInput" className="form-control-label">URL</label>                  
                    <input
                      id="urlInput"
                      className="form-control"
                      type="text"
                      name="url"
                      value={url}
                      onChange={this.updateField} />
                  </fieldset>                  

                  <fieldset className="form-group">
                    <label htmlFor="titleInput" className="form-control-label">Title</label>
                    <input
                      id="titleInput"
                      name="title"
                      className="form-control form-control-lg"
                      type="text"
                      value={title}
                      onChange={this.updateField} />
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="summaryInput" className="form-control-label">Summary</label>                  
                    <textarea
                      id="summaryInput"
                      name="summary"
                      className="form-control"
                      rows="8"
                      value={summary}
                      onChange={this.updateField}>
                    </textarea>
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="tagsInput" className="form-control-label">Tags</label>                  
                    <input
                      id="tagsInput"
                      name="tagInput"
                      className="form-control"
                      type="text"
                      value={tagInput}
                      onChange={this.updateField}
                      onKeyUp={this.watchForEnter} />                  

                    <div className="tag-list">
                        {tags.length > 0 && (tags.map((tag, index) => {
                          return (
                            <span className="tag-default tag-pill" key={tag}>
                              <i  className="ion-close-round"
                                  onClick={event => this.removeTagHandler(event, index)}>
                              </i>
                              {tag}
                            </span>
                          );
                        })
                        )}
                    </div>                        
                  </fieldset>

                                            

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="submit"
                    disabled={this.props.inProgress}
                    onClick={this.submitForm}>
                    Publish Article
                  </button>

                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
