import React from 'react'
import styled from 'styled-components'
import Img from "./p2.png"


function BlurImg() {
  const Blur = styled.img`
  width: 300px;
  filter:blur(4px);
  `;
  
  return(
    <Blur src={Img} />
  );   

}

export default BlurImg
