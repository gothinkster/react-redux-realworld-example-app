import ListErrors from './ListErrors';
import React, {useEffect} from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
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

const Editor = props => {

  const updateFieldEvent =
    key => ev => props.onUpdateField(key, ev.target.value);
  const changeTitle       = updateFieldEvent('title');
  const changeDescription = updateFieldEvent('description');
  const changeBody        = updateFieldEvent('body');
  const changeTagInput    = updateFieldEvent('tagInput');

  const watchForEnter = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      props.onAddTag();
    }
  };

  const removeTagHandler = tag => () => {
    props.onRemoveTag(tag);
  };

  const submitForm = ev => {
    ev.preventDefault();
    const article = {
      title:        props.title,
      description:  props.description,
      body:         props.body,
      tagList:      props.tagList
    };

    const slug = { slug: props.articleSlug };
    const promise = props.articleSlug ?
      agent.Articles.update(Object.assign(article, slug)) :
      agent.Articles.create(article);

    props.onSubmit(promise);
  };

  useEffect(() => {
    if (props.match.params.slug) {
      props.onUnload();
      props.onLoad(agent.Articles.get(props.match.params.slug));
    } else {
      props.onLoad(null);
    }
  }, [props.match.params.slug]);

  useEffect(() => {
    if (props.match.params.slug) {
      return props.onLoad(agent.Articles.get(props.match.params.slug));
    }
    props.onLoad(null);
    return () => props.onUnload();
  });

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">

            <ListErrors errors={props.errors}></ListErrors>

            <form>
              <fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    value={props.title}
                    onChange={changeTitle} />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="What's this article about?"
                    value={props.description}
                    onChange={changeDescription} />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    value={props.body}
                    onChange={changeBody}>
                  </textarea>
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter tags"
                    value={props.tagInput}
                    onChange={changeTagInput}
                    onKeyUp={watchForEnter} />

                  <div className="tag-list">
                    {
                      (props.tagList || []).map(tag => {
                        return (
                          <span className="tag-default tag-pill" key={tag}>
                            <i  className="ion-close-round"
                                onClick={removeTagHandler(tag)}>
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
                  disabled={props.inProgress}
                  onClick={submitForm}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
