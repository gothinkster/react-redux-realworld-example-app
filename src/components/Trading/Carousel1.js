import React from "react";
import Img from "./p2.png"
import Carousel from "react-elastic-carousel";
import styled from 'styled-components'

function Carousel1() {
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];
const Blur = styled.img`
width: 300px;
filter:blur(4px);
`;
const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  width: 100%;
  background-color: #00008B;
  color: #fff;
  margin: 0 45px;
  font-size: 4em;
`;

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Example to setup your carousel in react</h1>
      <div className="App">
        <Carousel breakPoints={breakPoints}>
          <Item><Blur src={Img} /></Item>
          <Item><Blur src={Img} /></Item>
          <Item><Blur src={Img} /></Item>
          <Item><Blur src={Img} /></Item>
          <Item><Blur src={Img}/></Item>
          <Item><Blur src={Img}/></Item>
          <Item><Blur src={Img}/></Item>
          <Item><Blur src={Img}/></Item>
        </Carousel>
      </div>
    </>
  );
}

export default Carousel1;
