import ListErrors from './ListErrors';
import React, {useEffect} from 'react';
import agent from '../agent';
import {connect} from 'react-redux';
import {
    ADD_TAG,
    EDITOR_PAGE_LOADED,
    REMOVE_TAG,
    ARTICLE_SUBMITTED,
    EDITOR_PAGE_UNLOADED,
    UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';
import usePrevious from "../hooks/usePrevious";
import useSingleton from "../hooks/useSingleton";

const mapStateToProps = state => ({
    ...state.editor
});

const mapDispatchToProps = dispatch => ({
    onAddTag: () =>
        dispatch({type: ADD_TAG}),
    onLoad: payload =>
        dispatch({type: EDITOR_PAGE_LOADED, payload}),
    onRemoveTag: tag =>
        dispatch({type: REMOVE_TAG, tag}),
    onSubmit: payload =>
        dispatch({type: ARTICLE_SUBMITTED, payload}),
    onUnload: payload =>
        dispatch({type: EDITOR_PAGE_UNLOADED}),
    onUpdateField: (key, value) =>
        dispatch({type: UPDATE_FIELD_EDITOR, key, value})
});

const Editor = (props) => {
    this.props = props;
    useSingleton (() => {
        const updateFieldEvent =
            key => ev => props.onUpdateField(key, ev.target.value);
        this.changeTitle = updateFieldEvent('title');
        this.changeDescription = updateFieldEvent('description');
        this.changeBody = updateFieldEvent('body');
        this.changeTagInput = updateFieldEvent('tagInput');

        this.watchForEnter = ev => {
            if (ev.keyCode === 13) {
                ev.preventDefault();
                props.onAddTag();
            }
        };

        this.removeTagHandler = tag => () => {
            props.onRemoveTag(tag);
        };

        this.submitForm = ev => {
            ev.preventDefault();
            const article = {
                title: this.props.title,
                description: this.props.description,
                body: this.props.body,
                tagList: this.props.tagList
            };

            const slug = {slug: this.props.articleSlug};
            const promise = this.props.articleSlug ?
                agent.Articles.update(Object.assign(article, slug)) :
                agent.Articles.create(article);

            this.props.onSubmit(promise);
        };
    });
    const previousProps = usePrevious(props);
    useEffect(() => {
        if (previousProps && previousProps.match.params.slug !== props.match.params.slug) {
            if (props.match.params.slug) {
                previousProps.onUnload();
                return previousProps.onLoad(agent.Articles.get(previousProps.match.params.slug));
            }
            previousProps.onLoad(null);
        }
        if (props.match.params.slug) {
            return props.onLoad(agent.Articles.get(props.match.params.slug));
        }
        props.onLoad(null);
        return function cleanup() {
            props.onUnload();
        };
    }, []);
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
                                        onChange={this.changeTitle}/>
                                </fieldset>

                                <fieldset className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="What's this article about?"
                                        value={props.description}
                                        onChange={this.changeDescription}/>
                                </fieldset>

                                <fieldset className="form-group">
                                    <textarea
                                        className="form-control"
                                        rows="8"
                                        placeholder="Write your article (in markdown)"
                                        value={props.body}
                                        onChange={this.changeBody}>
                                    </textarea>
                                </fieldset>

                                <fieldset className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter tags"
                                        value={props.tagInput}
                                        onChange={this.changeTagInput}
                                        onKeyUp={this.watchForEnter}/>

                                    <div className="tag-list">
                                        {
                                            (props.tagList || []).map(tag => {
                                                return (
                                                    <span className="tag-default tag-pill" key={tag}>
                                                      <i className="ion-close-round"
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
                                    disabled={props.inProgress}
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

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
