
import styled from 'styled-components';
export default styled.button`
  min-width: 200px;
  font-size: 18px;
  padding: 7px 10px;
  background-color: ${props => props.inputBg || "palevioletred"};
  margin: 0.5em;
 color:white;
 borderWidth: 1;
 border-radius: 1px;
 border: none;
 display: inline-block;
`;

