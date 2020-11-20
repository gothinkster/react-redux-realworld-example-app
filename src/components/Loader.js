import React, { useState } from 'react'
import { PropagateLoader } from 'react-spinners';

const Loader = (WrappedComponent) => {
  const HOC = (props) => {
    const [isLoading, setLoading] = useState(true);

    const setLoadingState = isComponentLoading => {
      setLoading(isComponentLoading);
    };
    return (
      <div>
        {isLoading && <PropagateLoader loading={isLoading} />}
        <WrappedComponent {...props} setLoading={setLoadingState} />
      </div>
    )
  }
  return HOC;
}

export default Loader;

