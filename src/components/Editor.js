import ListErrors from './ListErrors';
import React from 'react';
import SubmitArticle from "./services/article";
import { connect } from 'react-redux';

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
    this.isDisabled = this.isDisabled.bind(this);
    this.submitForm = this.submitForm.bind(this);
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

  isDisabled() {
    const {url, title, summary, tags} = this.state;
    if (url.length === 0 || title.length === 0 || summary.length === 0 || tags.length ===0) {
      return true;
    }
    return false;
  }

  submitForm(event) {
    const {url, title, summary, tags} = this.state;
    event.preventDefault();

    const article = {
      url,
      title,
      summary,
      tags
    };    
    SubmitArticle(article, this.props.currentUser);
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
                            <span className="tag-default tag-pill" key={index}>
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
                    type="button"
                    disabled={this.isDisabled()}
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

const mapStateToProps = state => {
  return {
    currentUser: state.common.currentUser  
  }
};

export default connect(mapStateToProps)(Editor);
