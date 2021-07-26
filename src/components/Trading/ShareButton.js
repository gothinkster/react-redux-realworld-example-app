import React from 'react'
import styled from 'styled-components'


function ShareButton() {
    const Button = styled.button`
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;
  `;
  
  
  
  return(
    <div>
      <Button>Share</Button>
  
    </div>
  );   


}

export default ShareButton