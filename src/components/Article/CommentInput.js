import React, { useState } from 'react'
import { connect } from 'react-redux'

import { addComment } from '../../reducers/article'

const mapDispatchToProps = dispatch => ({
  onSubmit: payload => dispatch(addComment(payload))
})

function CommentInput (props) {
  const [body, setBody] = useState('')

  const handleBodyUpdated = ev => {
    setBody(ev.target.value)
  }

  const createComment = ev => {
    ev.preventDefault()
    props.onSubmit({
      slug: props.slug,
      comment: body
    })
    setBody('')
  }

  return (
    <form className='card comment-form' onSubmit={createComment}>
      <div className='card-block'>
        <textarea
          className='form-control'
          placeholder='Write a comment...'
          value={body}
          onChange={handleBodyUpdated}
          rows='3'
        />
      </div>
      <div className='card-footer'>
        <img
          src={props.currentUser.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
          className='comment-author-img'
          alt={props.currentUser.username}
        />
        <button
          className='btn btn-sm btn-primary'
          type='submit'
        >
          Post Comment
        </button>
      </div>
    </form>
  )
}

export default connect(() => ({}), mapDispatchToProps)(React.memo(CommentInput))
