import React from 'react'
import styled from 'styled-components'

function ListToGrid() {
    const Container = styled.div`
        position:absolute;
        transform:translated(-50%, -50%);
        width:500px;
        height:100%;
        margin: 100px auto;
    `
    const Icon = styled.div`
        width:100px;
        height:80px;
        padding:10px;
        position: absolute;
        right:-10px;
        display:flex;
    `
    const List  = styled.div`
        width:65px;
        height:45px;
        position:relative;
        cursor:pointer;
        margin:0 10px 0 0;
    `
    const ListSpan = styled.span`
        width:20px;
        height:4px;
        background:black;
        position:absolute;
        top:5px;
        left:20px;
        &:nth-child(2){
            top:11px;
        }
        &:nth-child(3){
            top:18px;
        }
    `
    const Grid = styled.div`
        width:35px;
        height:35px;
        position:relative;
        cursor:pointer;
        margin:0 10px 0 0;
    `
    const GridSpan = styled.div`
        width : 7px;
        height : 7px;
        background:black;
        position:absolute;
        left:10px;
        top:5px;
        &:nth-child(1){
            top:15px;
        }
    `
    return (
        <Container>
            <Icon>
                <List>
                    <ListSpan></ListSpan>
                    <ListSpan></ListSpan>
                    <ListSpan></ListSpan>
                    <Grid>
                        <GridSpan></GridSpan>
                        <GridSpan></GridSpan>
                    </Grid>
                </List>
                
            </Icon>
        </Container>
    )
}

export default ListToGrid
