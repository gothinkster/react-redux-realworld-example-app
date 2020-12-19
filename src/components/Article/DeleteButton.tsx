import React from "react"
import agent from "../../agent"
import { connect } from "react-redux"
import { DELETE_COMMENT } from "../../constants/actionTypes"

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; payload: any; commentId: number }) => any,
) => ({
  onClick: (payload: any, commentId: number) =>
    dispatch({ type: DELETE_COMMENT, payload, commentId }),
})

const DeleteButton = (props: {
  slug: any
  commentId: any
  onClick: (arg0: Promise<any>, arg1: any) => void
  show: any
}) => {
  const del = () => {
    const payload = agent.Comments.delete(props.slug, props.commentId)
    props.onClick(payload, props.commentId)
  }

  if (props.show) {
    return (
      <span className="mod-options">
        <i className="ion-trash-a" onClick={del}></i>
      </span>
    )
  }
  return null
}

export default connect(() => ({}), mapDispatchToProps)(DeleteButton)
