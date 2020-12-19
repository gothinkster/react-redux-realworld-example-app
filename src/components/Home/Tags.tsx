import agent from "../../agent"

const Tags = (props: {
  tags: any
  onClickTag: (arg0: any, arg1: (page: number) => Promise<any>, arg2: Promise<any>) => void
}) => {
  const tags = props.tags
  if (tags) {
    return (
      <div className="tag-list">
        {tags.map((tag: string) => {
          const handleClick = (ev: { preventDefault: () => void }) => {
            ev.preventDefault()
            props.onClickTag(
              tag,
              (page: number) => agent.Articles.byTag(tag, page),
              agent.Articles.byTag(tag),
            )
          }

          return (
            <a href="" className="tag-default tag-pill" key={tag} onClick={handleClick}>
              {tag}
            </a>
          )
        })}
      </div>
    )
  } else {
    return <div>Loading Tags...</div>
  }
}

export default Tags
