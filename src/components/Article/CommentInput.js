import React from 'react';
import { connect } from 'react-redux';

import { addComment } from '../../reducers/article';

const mapDispatchToProps = dispatch => ({
  onSubmit: payload => dispatch(addComment(payload)),
});

class CommentInput extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      body: ''
    };

    this.setBody = ev => {
      this.setState({ body: ev.target.value });
    };

    this.createComment = ev => {
      ev.preventDefault();
      this.props.onSubmit({
        slug: this.props.slug,
        comment: this.state.body,
      });
      this.setState({ body: '' });
    };
  }

  render() {
    return (
      <form className="card comment-form" onSubmit={this.createComment}>
        <div className="card-block">
          <textarea className="form-control"
            placeholder="Write a comment..."
            value={this.state.body}
            onChange={this.setBody}
            rows="3">
          </textarea>
        </div>
        <div className="card-footer">
          <img
            src={this.props.currentUser.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
            className="comment-author-img"
            alt={this.props.currentUser.username} />
          <button
            className="btn btn-sm btn-primary"
            type="submit">
            Post Comment
          </button>
        </div>
      </form>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(React.memo(CommentInput));
