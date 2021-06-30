import React from 'react';

const Tags = React.memo(props => {
  const tags = props.tags;

  if (!tags) {
    return <div>Loading Tags...</div>;
  }

  return (
    <div className="tag-list">
      {tags.map(tag => {
        const handleClick = ev => {
          ev.preventDefault();
          props.onClickTag(tag);
        };

        return (
          <button
            type="button"
            className="tag-default tag-pill"
            key={tag}
            onClick={handleClick}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
});

export default Tags;
