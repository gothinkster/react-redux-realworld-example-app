import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Shows a banner for new users
 *
 * @example
 * <Banner />
 */
function Banner() {
  const appName = useSelector(state => state.common.appName);
  const token = useSelector(state => state.common.token);

  if (token) {
    return null;
  }

  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">{appName.toLowerCase()}</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  );
}

export default Banner;
