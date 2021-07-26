import React from 'react'
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import styled from 'styled-components'


function AddButton() {
    const IconAdd = styled.div`
        width:40px;
        height:40px;
        background:transparent;
        text-align:center;
        position:relative;
        padding:3px;
        &:hover{
            border-radius:50%;
            background: #D3D3D3 radial-gradient(circle, transparent 1%, #D3D3D3 1%) center/15000%;
            background-position: center;
            transition: background 0.5s;

        }
    `
    return (
        <IconAdd>
            <AddRoundedIcon fontSize="Large" color="black"/>
        </IconAdd>
    )
}

export default AddButton
