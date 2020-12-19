import Comment from "./Comment"
import React from "react"

const CommentList = (props: {
  comments: any[]
  currentUser: { username: string }
  slug: string
}) => {
  return (
    <div>
      {props.comments.map((comment: { id: string | number | null | undefined }) => {
        return (
          <Comment
            comment={comment}
            currentUser={props.currentUser}
            slug={props.slug}
            key={comment.id}
          />
        )
      })}
    </div>
  )
}

export default CommentList
