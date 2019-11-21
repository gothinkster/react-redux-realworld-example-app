import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { DELETE_COMMENT } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload, commentId) =>
    dispatch({ type: DELETE_COMMENT, payload, commentId })
});

const DeleteButton = ({ commentId, show, slug, onClick }) => {
  const del = () => {
    const payload = agent.Comments.delete(slug, commentId);
    onClick(payload, commentId);
  };

  if (!show) {
    return null;
  }

  return (
    <span className="mod-options">
      <i className="ion-trash-a" onClick={del}></i>
    </span>
  );
};

export default connect(() => ({}), mapDispatchToProps)(DeleteButton);
