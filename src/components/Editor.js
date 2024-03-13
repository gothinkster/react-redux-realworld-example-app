import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ListErrors from './ListErrors';
import {
  getArticle,
  createArticle,
  updateArticle,
  articlePageUnloaded,
} from '../reducers/article';
import { useNavigate, useParams } from 'react-router';

/**
 * Editor component
 * @param {import('react-router-dom').RouteComponentProps<{ slug?: string }>} props
 * @example
 * <Editor />
 */
function Editor({ match }) {
  const dispatch = useDispatch();
  const { article, errors, inProgress } = useSelector((state) => state.article);
  const { slug } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagList, setTagList] = useState([]);
  const navigate = useNavigate();
  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeDescription = (event) => {
    setDescription(event.target.value);
  };

  /**
   * @type {React.ChangeEventHandler<HTMLAreaElement>}
   */
  const changeBody = (event) => {
    setBody(event.target.value);
  };

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeTagInput = (event) => {
    setTagInput(event.target.value);
  };

  /**
   * Reset the form values
   */
  const reset = () => {
    if (slug && article) {
      setTitle(article.title);
      setDescription(article.description);
      setBody(article.body);
      setTagList(article.tagList);
    } else {
      setTitle('');
      setDescription('');
      setBody('');
      setTagInput('');
      setTagList([]);
    }
  };

  /**
   * Add a tag to tagList
   * @type {React.KeyboardEventHandler<HTMLInputElement>}
   */
  const addTag = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (tagInput && !tagList.includes(tagInput))
        setTagList([...tagList, tagInput]);

      setTagInput('');
    }
  };

  /**
   * Remove a tag from tagList
   *
   * @param {String} tag
   * @returns {React.MouseEventHandler}
   */
  const removeTag = (tag) => () => {
    setTagList(tagList.filter((_tag) => _tag !== tag));
  };

  /**
   * @type {React.MouseEventHandler<HTMLButtonElement>}
   */
  const submitForm = (event) => {
    event.preventDefault();
    const article = {
      slug,
      title,
      description,
      body,
      tagList,
    };

    dispatch(slug ? updateArticle(article) : createArticle(article));
    navigate('/');
  };

  useEffect(() => {
    reset();
    if (slug) {
      dispatch(getArticle(slug));
    }
  }, [slug]);

  useEffect(reset, [article]);

  useEffect(() => () => dispatch(articlePageUnloaded()), []);

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={errors} />

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    value={title}
                    onChange={changeTitle}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={changeDescription}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    value={body}
                    onChange={changeBody}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter tags"
                    value={tagInput}
                    onChange={changeTagInput}
                    onKeyUp={addTag}
                  />

                  <div className="tag-list">
                    {tagList.map((tag) => {
                      return (
                        <span className="tag-default tag-pill" key={tag}>
                          <i
                            className="ion-close-round"
                            onClick={removeTag(tag)}
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
                  disabled={inProgress}
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
  );
}

export default memo(Editor);
