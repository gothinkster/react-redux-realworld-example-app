import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100px;
  height: 150px;
  border: 3px solid ${props => props.color};
  border-radius: 0px;
  justify-content: space-around;
  font-size: 5em;
  color: ${props => props.color};
`;

const Content = styled.div`
  align-self: center;
`;

const Card = ({ children, color = 'black' }) => (
  <Container color={color}>
    <Content>
      {children}
    </Content>
  </Container>
);

export default Card;
