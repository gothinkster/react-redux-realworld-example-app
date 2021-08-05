import React from "react";
import Carousel from "react-elastic-carousel";
import BlurImg from './BlurImg'

function Carousel1() {
  const breakPoints = [
    { width: 1 },
    { width: 550},
    { width: 768},
    { width: 1200 },
  ];
  
  return(
    <>
    
    <div className="App">
      <Carousel breakPoints={breakPoints}>
        
     <BlurImg></BlurImg>
     <BlurImg></BlurImg>
     <BlurImg></BlurImg>
     <BlurImg></BlurImg>
     <BlurImg></BlurImg>
     <BlurImg></BlurImg>
      </Carousel>
    </div>
  </>

  );   

}

export default Carousel1
