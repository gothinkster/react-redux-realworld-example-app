import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getArticlesByTag, getAllTags } from '../../reducers/articleList';

/**
 * Show all tags
 *
 * @example
 * <Tags />
 */
function Tags() {
  const dispatch = useDispatch();
  const tags = useSelector(state => state.articleList.tags);

  useEffect(() => {
    const fetchTags = dispatch(getAllTags());

    return () => {
      fetchTags.abort();
    };
  }, []);

  if (!tags || tags.length < 1) {
    return <div>Loading Tags...</div>;
  }

  /**
   * Dispatch get all articles by a tag
   *
   * @param {String} tag
   * @returns {React.MouseEventHandler}
   */
  const handleClickTag = tag => () => {
    dispatch(getArticlesByTag({ tag }));
  };

  return (
    <div className="tag-list">
      {tags.map(tag => (
        <button
          type="button"
          className="tag-default tag-pill"
          key={tag}
          onClick={handleClickTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default Tags;
