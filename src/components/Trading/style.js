import styled from 'styled-components';

const Container = styled.div`
    margin:2px;
    padding:2px;

`
const Wrapper = styled.div`
        position:relative;
        display:flex;
        min-width:100px;
        border : 2px solid grey;
        border-radius : 25px;
        background-color:#f5f5f5;
        margin :5px 10px;
        padding : 8px 5px 5px 5px;
    `
    const IconSearch = styled.div`
        position: absolute;
        top: 6px;
        padding:0px 3px;
        left: 8px;
        width: 14px;
    `
    const TextBox = styled.input`
        border: none;
        height : 20px;
        width:100%;
        font-size:16px;
        margin:0;
        margin-left:4px;
        padding : 0px 23px 0px 30px;
        outline:0;
        background-color:#f5f5f5; 
    `
    const IconClose = styled.div`
        position:absolute;
        cursor: pointer;
        visibility : hidden;
    `
    
export {
      Container, Wrapper,IconSearch , TextBox,IconClose
  }