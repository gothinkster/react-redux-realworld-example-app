import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

  const HOCLoader = props => {
    const { promiseInProgress } = usePromiseTracker();

    return promiseInProgress && 
      <div      
      style={{
         width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
        </div>  
   };


HOCLoader.propTypes = {};

HOCLoader.defaultProps = {};

export default HOCLoader;
