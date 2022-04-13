import React, { memo } from 'react';

/**
 * List article's tags
 *
 * @param {object}   props
 * @param {string[]} props.tags
 * @example
 * <TagsList tags={['dragons', 'training']} />
 */
function TagsList({ tags }) {
  return (
    <ul className="tag-list">
      {tags.map((tag) => (
        <li className="tag-default tag-pill tag-outline" key={tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}

export default memo(TagsList);
