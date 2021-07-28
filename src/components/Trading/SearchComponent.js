import React, { useState } from 'react';
import { Container,Wrapper,IconSearch, TextBox,IconClose , SearchedValue } from './style';
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import { Component } from 'react';

function SearchComponent() {

  const [data, setData] = useState('');
  const [searchedKey, setSearchedKey] = useState('');
  const searchText = (event) => {
    setData(event.target.value);
    
  }
  const handle = (event) => {
    if (event.charCode === 13) {
      setSearchedKey(event.target.value)
      event.target.value = null;
    }
  }
  

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
    

  return (
      <Container>
        <Wrapper>
            <IconSearch><SearchIcon theme="filled" /></IconSearch>
        <TextBox type="search" value={data} onChange={searchText.bind(this)} onKeyPress={handle.bind(this)}
          placeholder="Search by Card Name" />
            <IconClose className="clear-icon"><CloseIcon/></IconClose>
      </Wrapper>
      <h3>{ searchedKey}</h3>
      </Container>
    )
}

export default SearchComponent
