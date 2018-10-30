import React from "react";
import ListErrors from "./ListErrors";
import { SubmitArticle } from "../services/article";
import { connect } from "react-redux";

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
      snippets: [],
      options: ["Tutorial", "Op-Ed", "Stack Overflow"]
    };

    this.keyCodes = {
      enter: 13,
      tab: 9,
      comma: 188
    };

    this.updateField = this.updateField.bind(this);
    this.onHandleSnippetKeyPress = this.onHandleSnippetKeyPress.bind(this);
    this.onHandleTagKeyPress = this.onHandleTagKeyPress.bind(this);
    this.removeTagHandler = this.removeTagHandler.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.insertLineBreaks = this.insertLineBreaks.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  updateField(event) {
    this.setState({ [event.target.name]: event.target.value });
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

  onHandleTagKeyPress(event) {
    const { tags, tagInput } = this.state;
    const { enter, tab, comma } = this.keyCodes;

    if (
      tagInput.length &&
      (event.which === enter || event.which === tab || event.which === comma)
    ) {
      this.setState({
        tags: [...tags, tagInput],
        tagInput: ""
      });
    }
  }

  onHandleSnippetKeyPress(event) {
    const { snippets, snippetInput } = this.state;
    const { enter } = this.keyCodes;
    if (event.which === enter) {
      this.setState({
        snippets: [...snippets, snippetInput],
        snippetInput: ""
      });
    }
  }

  removeTagHandler(event, index) {
    event.persist();
    const arr = this.state[event.target.getAttribute("name")] || [];
    arr.splice(index, 1);
    this.setState({ [event.target.name]: arr });
  }

  isDisabled() {
    const { url, title, summary, tags, type, snippets } = this.state;
    const postTypeValidValue =
      type === "Stack Overflow Post" ? snippets : summary;
    const arr = [url, title, tags, postTypeValidValue];
    let bool = false;
    arr.map(value => {
      if (value.length === 0) {
        bool = true;
        return;
      }
    });
    return bool;
  }

  insertLineBreaks(text) {
    const arr = text.split(/\r\n|\r|\n/g);
    return arr.length > 0 ? arr : [text];
  }

  submitForm(event) {
    const { url, title, summary, tags, type, snippets } = this.state;
    event.preventDefault();

    const article = {
      url,
      title,
      summary,
      tags,
      type,
      snippets
    };
    SubmitArticle(article);
    this.resetFields();
  }

  render() {
    const {
      url,
      title,
      summary,
      tagInput,
      tags,
      type,
      snippetInput,
      snippets
    } = this.state;
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <ListErrors errors={this.props.errors} />

              <form>
                <fieldset>
                  <fieldset className="form-group" style={{ maxWidth: 250 }}>
                    <label htmlFor="typeSelect">Article Type</label>
                    <select
                      id="typeSelect"
                      name="type"
                      className="form-control"
                      value={type}
                      onChange={event => this.updateField(event)}
                    >
                      <option value="Tutorial">Tutorial</option>
                      <option value="Op-Ed">Op-Ed</option>
                      <option value="Stack Overflow Post">
                        Stack Overflow Post
                      </option>
                    </select>
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="urlInput" className="form-control-label">
                      URL
                    </label>
                    <input
                      id="urlInput"
                      className="form-control"
                      type="text"
                      name="url"
                      value={url}
                      onChange={event => this.updateField(event)}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="titleInput" className="form-control-label">
                      Title
                    </label>
                    <input
                      id="titleInput"
                      name="title"
                      className="form-control form-control-lg"
                      type="text"
                      value={title}
                      onChange={event => this.updateField(event)}
                    />
                  </fieldset>

                  {type !== "Stack Overflow Post" ? (
                    <fieldset className="form-group">
                      <label
                        htmlFor="summaryInput"
                        className="form-control-label"
                      >
                        Summary
                      </label>
                      <textarea
                        id="summaryInput"
                        name="summary"
                        className="form-control"
                        rows="8"
                        value={summary}
                        onChange={event => this.updateField(event)}
                      />
                    </fieldset>
                  ) : null}

                  {type === "Stack Overflow Post" ? (
                    <fieldset className="form-group">
                      <label
                        htmlFor="snippetInput"
                        className="form-control-label"
                      >
                        Snippet
                      </label>
                      <textarea
                        id="snippetInput"
                        name="snippetInput"
                        className="form-control"
                        value={snippetInput}
                        rows={4}
                        onChange={event => this.updateField(event)}
                        onKeyUp={event => this.onHandleSnippetKeyPress(event)}
                      />
                      <div>
                        {snippets.length > 0 &&
                          snippets.map((snippet, index) => {
                            return (
                              <div
                                className="snippet-container"
                                key={`snippet${index}`}
                              >
                                <i
                                  className="ion-close-round"
                                  name="snippets"
                                  onClick={event =>
                                    this.removeTagHandler(event, index)
                                  }
                                />
                                <br />
                                {this.insertLineBreaks(snippet).map(
                                  (snippetLine, i) => {
                                    return (
                                      <span
                                        className="snippet-span"
                                        key={`snippetLine${i}`}
                                      >
                                        {snippetLine}
                                      </span>
                                    );
                                  }
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </fieldset>
                  ) : null}

                  <fieldset className="form-group">
                    <label htmlFor="tagsInput" className="form-control-label">
                      Tags
                    </label>
                    <input
                      id="tagsInput"
                      name="tagInput"
                      className="form-control"
                      type="text"
                      value={tagInput}
                      onChange={event => this.updateField(event)}
                      onKeyUp={event => this.onHandleTagKeyPress(event)}
                    />

                    <div className="tag-list">
                      {tags.length > 0 &&
                        tags.map((tag, index) => {
                          return (
                            <span
                              className="tag-default tag-pill"
                              key={`${tag}${index}`}
                            >
                              <i
                                className="ion-close-round"
                                name="tags"
                                onClick={event =>
                                  this.removeTagHandler(event, index)
                                }
                              />
                              {tag}
                            </span>
                          );
                        })}
                    </div>
                  </fieldset>
                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={this.isDisabled()}
                    onClick={event => this.submitForm(event)}
                  >
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
  };
};

export default connect(mapStateToProps)(Editor);
