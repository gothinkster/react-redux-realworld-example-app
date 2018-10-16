import ListErrors from './ListErrors';
import React from 'react';
import { SubmitArticle } from "./services/article";

class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      url: "",
      title: "",
      summary: "",
      tagInput: "",
      tags: [],
      type: "Tutorial",
      snippetInput: "",
      snippets: []
    };    

    this.updateField = this.updateField.bind(this);
    this.watchForEnter = this.watchForEnter.bind(this);
    this.removeTagHandler = this.removeTagHandler.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.insertLineBreaks = this.insertLineBreaks.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  updateField(event) {
    this.setState({[event.target.name]: event.target.value});
  }  

  resetFields() {
    this.setState({
      url: "",
      title: "",
      summary: "",
      tagInput: "",
      tags: [],
      type: "Tutorial",
      snippetInput: "",
      snippets: []
    });
  }

  watchForEnter(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      switch(event.target.name) {
        case "tagInput" :
          this.setState(prevState => ({tags: [...prevState.tags, prevState.tagInput], tagInput: ""}));          
        break;
        case "snippetInput" :
          this.setState(prevState => ({snippets: [...prevState.snippets, prevState.snippetInput], snippetInput: ""}));          
        break;

        default: 
        break;
      }     
    }
  };

  removeTagHandler(event, index) { 
    event.persist();   
    const arr = this.state[event.target.getAttribute("name")] || [];
    arr.splice(index, 1);
    this.setState({[event.target.name] : arr});
  };

  isValidUrl(url) {
    //simple validation forces the link provided to use http or https protocol for at least a touch
    //more safety
    const regExp = /^((http|https):\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
    return url.match(regExp) ? true : false;

  }

  isDisabled() {
    const {url, title, summary, tags, type, snippets} = this.state;
    if (type !== "Stack Overflow Post" && (url.length === 0 || !this.isValidUrl(url) || title.length === 0 || summary.length === 0 || tags.length === 0)) {
      return true;
    }
    else if (type === "Stack Overflow Post" && (url.length === 0 || !this.isValidUrl(url) || title.length === 0 || snippets.length === 0 || tags.length === 0)) {
      return true;
    }
    return false;
  }

  insertLineBreaks(text) {
    const arr = text.split(/\r\n|\r|\n/g);
    return arr.length > 0 ? arr : [text];
  }

  submitForm(event) {
    const {url, title, summary, tags, snippets} = this.state;
    const views = 0;
    event.preventDefault();

    const article = {
      url,
      title,
      summary,
      tags,
      views,
      snippets
    };    
    
    SubmitArticle(article);
    this.resetFields();
  };

  render() {
    const {url, title, summary, tagInput, tags, type, snippetInput, snippets} = this.state;
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
                <fieldset>

                  <fieldset className="form-group" style={{maxWidth: 250}}>
                  <label htmlFor="typeSelect">Article Type</label>
                    <select id="typeSelect" 
                      name="type"   
                      className="form-control" 
                      value={type} 
                      onChange={this.updateField} >
                      <option>Tutorial</option>
                      <option>Op-Ed</option>
                      <option>Stack Overflow Post</option>                                        
                    </select>
                  </fieldset>

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

                  {type !== "Stack Overflow Post" ? (
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
                  ) : null }                  

                  {type === "Stack Overflow Post" ? (
                  <fieldset className="form-group">
                  <label htmlFor="snippetInput" className="form-control-label">Snippet</label>                  
                  <textarea
                    id="snippetInput"
                    name="snippetInput"
                    className="form-control"
                    value={snippetInput}
                    rows={4}
                    onChange={this.updateField}
                    onKeyUp={this.watchForEnter} />                                      
                    <div>
                        {snippets.length > 0 && (snippets.map((snippet, index) => {
                          return (
                            <div className="snippet-container" key={`snippet${index}`}>
                              <i  className="ion-close-round"
                                  name="snippets"
                                  onClick={event => this.removeTagHandler(event, index)}>
                              </i>
                              {this.insertLineBreaks(snippet).map((snippetLine, i) => {
                                return (
                                  <span className="snippet-span" key={`snippetLine${i}`}>
                                    {snippetLine}
                                  </span>
                                )
                              })}
                            </div>
                          );
                        })
                        )}
                    </div>                    
                  </fieldset>                  
                  ) : null }


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
                            <span className="tag-default tag-pill" key={`tag${index}`}>
                              <i  className="ion-close-round"
                                  name="tags"
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

export default Editor;
