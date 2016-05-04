'use strict';

import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import store from '../store';

class Editor extends React.Component {
  constructor() {
    super();
    this.state = store.getState();

    const updateFieldEvent = key => ev => store.dispatch({
      type: 'UPDATE_FIELD',
      key,
      value: ev.target.value
    });
    this.changeTitle = updateFieldEvent('title');
    this.changeDescription = updateFieldEvent('description');
    this.changeBody = updateFieldEvent('body');
    this.changeTagInput = updateFieldEvent('tagInput');

    this.watchForEnter = ev => {
      if (ev.keyCode === 13) {
        ev.preventDefault();
        store.dispatch({ type: 'ADD_TAG' });
      }
    };

    this.removeTagHandler = tag => () => {
      store.dispatch({ type: 'REMOVE_TAG', tag });
    };

    this.submitForm = ev => {
      ev.preventDefault();
      const article = {
        title: this.state.title,
        description: this.state.description,
        body: this.state.body,
        tagList: this.state.tagList
      };

      const slug = { slug: this.state.articleSlug };
      const promise = this.state.articleSlug ?
        agent.Articles.update(Object.assign(article, slug)) :
        agent.Articles.create(article);

      store.dispatch({
        type: 'ARTICLE_SUBMITTED',
        payload: promise
      });
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillMount() {
    const action = { type: 'EDITOR_PAGE_LOADED' };
    if (this.props.params.slug) {
      action.payload = agent.Articles.get(this.props.params.slug);
    }
    store.dispatch(action);
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    store.dispatch({ type: 'EDITOR_PAGE_UNLOADED' });
  }

  render() {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={this.state.errors}></ListErrors>

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Article Title"
                      value={this.state.title}
                      onChange={this.changeTitle} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      value={this.state.description}
                      onChange={this.changeDescription} />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                      value={this.state.body}
                      onChange={this.changeBody}>
                    </textarea>
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags"
                      value={this.state.tagInput}
                      onChange={this.changeTagInput}
                      onKeyUp={this.watchForEnter} />

                    <div className="tag-list">
                      {
                        (this.state.tagList || []).map(tag => {
                          return (
                            <span className="tag-default tag-pill" key={tag}>
                              <i  className="ion-close-round"
                                  onClick={this.removeTagHandler(tag)}>
                              </i>
                              {tag}
                            </span>
                          );
                        })
                      }
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={this.state.inProgress}
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
