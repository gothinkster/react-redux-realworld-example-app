import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getArticlesByTag } from '../../reducers/articleList';
import { getAllTags, selectIsLoading, selectTags } from './tagsSlice';

/**
 * Show all tags in the sidebar
 *
 * @example
 * <TagsSidebar />
 */
function TagsSidebar() {
  const dispatch = useDispatch();
  const tags = useSelector(selectTags);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    const fetchTags = dispatch(getAllTags());

    return () => {
      fetchTags.abort();
    };
  }, []);

  /**
   * Dispatch get all articles by a tag
   *
   * @param {String} tag
   * @returns {React.MouseEventHandler}
   */
  const handleClickTag = (tag) => () => {
    dispatch(getArticlesByTag({ tag }));
  };

  return (
    <div className="sidebar">
      <p>Popular Tags</p>

      <div className="tag-list">
        {isLoading ? (
          <p>Loading Tags...</p>
        ) : (
          tags.map((tag) => (
            <button
              type="button"
              className="tag-default tag-pill"
              key={tag}
              onClick={handleClickTag(tag)}
            >
              {tag}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default memo(TagsSidebar);
