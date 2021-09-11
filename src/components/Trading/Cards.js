import React from 'react'
import styled from 'styled-components'

function Cards(props) {
    const CardList = styled.div`
        display:flex;
        flex-wrap : wrap;
        @media only screen and (max-width:480px){
            flex-direction:column;
        }
    `
    const Card = styled.div`
        width: 300px;
        height : 300px;
        text-align:center;
        background:gray;
        margin:20px;
        position:relative;
        @media only screen and (max-width:480px){
            width:100%;
            height:200px;
            margin:10px;
            overflow-y:scroll;
        }
    `
    const CardName = styled.h2`
        font-family:font-family: Arial, Helvetica, sans-serif;
        font-size:24px;
        position:absolute;
        top:30%;
        left:40%;
    `
    return (
        <CardList>
            {props.decks.map(deck => (
                <Card>
                    <CardName>{deck.name}</CardName>
                </Card>
            ))}
        </CardList>
    )
}

export default Cards
