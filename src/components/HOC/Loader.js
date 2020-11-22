import React from 'react';
import Spinner from 'react-loader-spinner';

const Loader = (WrappedComponent) => {
    return(props) => {
        if (!props.articles) {
            return (
              <div className="article-preview">
                <div style={{width: "100%", display: "flex"}}>
                    <Spinner 
                        type="TailSpin" 
                        color="#5cb85c" 
                        height={80} width={80} 
                        style={{margin: "auto"}}
                    />
                </div>
              </div>
            );
          }
        
          if (props.articles.length === 0) {
            return (
              <div className="article-preview">
                No articles are here... yet.
              </div>
            );
          }
        return(
            <div>
                <WrappedComponent {...props}/>
            </div>
        )
    }
}

export default Loader;
