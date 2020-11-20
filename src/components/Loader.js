import React, { useState } from 'react'
import { css } from "@emotion/core";
import { PropagateLoader } from 'react-spinners';

const Loader = (WrappedComponent) => {
  const HOC = (props) => {
    const [isLoading, setLoading] = useState(true);

    const setLoadingState = isComponentLoading => {
      setLoading(isComponentLoading);
    };
    return (
      <div>
        {isLoading && <PropagateLoader css={override} color={"#62B85C"} loading={isLoading} />}
        <WrappedComponent {...props} setLoading={setLoadingState} />
      </div>
    )
  }
  return HOC;
}

const override = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
`;

export default Loader;

