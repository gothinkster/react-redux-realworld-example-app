import React from 'react';
import { connect } from 'react-redux';

import ListErrors from './ListErrors';
import {
  getArticle,
  createArticle,
  updateArticle,
  articlePageUnloaded,
} from '../reducers/article';

const mapStateToProps = state => ({
  articleSlug: state.article.article?.slug,
  title: state.article.article?.title,
  description: state.article.article?.description,
  body: state.article.article?.body,
  tagList: state.article.article?.tagList,
  inProgress: state.article.inProgress,
  errors: state.article.errors,
});

const mapDispatchToProps = dispatch => ({
  onLoad: slug => dispatch(getArticle(slug)),
  onSubmit: (articleSlug, article) =>
    dispatch(articleSlug ? updateArticle(article) : createArticle(article)),
  onUnload: () => dispatch(articlePageUnloaded()),
});

class Editor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      articleSlug: props.articleSlug,
      title: props.title ?? '',
      description: props.description ?? '',
      body: props.body ?? '',
      tagInput: '',
      tagList: props.tagList ?? [],
    };
  }

  updateFieldEvent = key => event =>
    this.setState(prevState => ({
      ...prevState,
      [key]: event.target.value,
    }));

  watchForEnter = event => {
    if (event.keyCode === 13) {
      event.preventDefault();

      this.setState(prevState => ({
        ...prevState,
        tagList: [...prevState.tagList, prevState.tagInput],
        tagInput: '',
      }));
    }
  };

  removeTagHandler = tag => () => {
    this.setState(prevState => ({
      ...prevState,
      tagList: prevState.tagList.filter(_tag => _tag !== tag),
    }));
  };

  submitForm = event => {
    event.preventDefault();
    const { tagInput, articleSlug, ...article } = this.state;

    this.props.onSubmit(articleSlug, article);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.slug !== this.props.match.params.slug) {
      if (this.props.match.params.slug) {
        this.props.onUnload();
        this.props.onLoad(this.props.match.params.slug);
      }
      this.props.onLoad(null);
    }
  }

  componentDidMount() {
    if (this.props.match.params.slug) {
      this.props.onLoad(this.props.match.params.slug);
    }
    this.props.onLoad(null);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <ListErrors errors={this.props.errors} />

              <form>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Article Title"
                      value={this.state.title}
                      onChange={this.updateFieldEvent('title')}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      value={this.state.description}
                      onChange={this.updateFieldEvent('description')}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                      value={this.state.body}
                      onChange={this.updateFieldEvent('body')}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags"
                      value={this.state.tagInput}
                      onChange={this.updateFieldEvent('tagInput')}
                      onKeyUp={this.watchForEnter}
                    />

                    <div className="tag-list">
                      {this.state.tagList.map(tag => {
                        return (
                          <span className="tag-default tag-pill" key={tag}>
                            <i
                              className="ion-close-round"
                              onClick={this.removeTagHandler(tag)}
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
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
