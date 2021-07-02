import React from 'react'
import { connect } from 'react-redux'

import { deleteComment } from '../../reducers/article'

const mapDispatchToProps = dispatch => ({
  onClick: payload => dispatch(deleteComment(payload))
})

const DeleteButton = props => {
  const del = () => {
    props.onClick({
      slug: props.slug,
      commentId: props.commentId
    })
  }

  if (props.show) {
    return (
      <span className='mod-options'>
        <i className='ion-trash-a' onClick={del} />
      </span>
    )
  }
  return null
}

export default connect(() => ({}), mapDispatchToProps)(React.memo(DeleteButton))
