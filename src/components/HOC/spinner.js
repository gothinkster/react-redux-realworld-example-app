import React from 'react';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"



const LoadingSpinnerHoc = (Component) => (props) =>{
  const tags = props.tags;
  const article=props.articles;

  if (tags || article) {
    return (
    <div>
  <Component {...props} />

   </div>
    ) 
  }
  else
  {
    return (
      <Loader
      type="ThreeDots"
      color="#00BFFF"
      height={100}
      width={100}
      timeout={3000} //3 secs

   />
    );
  }
 

}

export default LoadingSpinnerHoc;