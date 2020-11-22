import React from 'react';
import agent from '../../agent';
import  LoadingSpinnerHoc from '../HOC/spinner'

const Tags = props => {
  const tags = props.tags;
 
    return (
      <div className="tag-list">
        {
          tags.map(tag => {
            const handleClick = ev => {
              ev.preventDefault();
              props.onClickTag(tag, page => agent.Articles.byTag(tag, page), agent.Articles.byTag(tag));
            };

            return (
              <a
                href=""
                className="tag-default tag-pill"
                key={tag}
                onClick={handleClick}>
                {tag}
              </a>
            );
          })
        }
      </div>
    );
};

export default LoadingSpinnerHoc(Tags);
