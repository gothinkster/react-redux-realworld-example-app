import React, { useState } from 'react'

var DateTime = () => {
  const [data, setData] = useState(null);
  const [onEnter, setOnEnter] = useState(false);
  var showDate = new Date();
  var displayTodaysDate = showDate.getDate() + '/' + (showDate.getMonth() + 1) + '/' + showDate.getFullYear();
  var dt = showDate.toDateString();
  var time = showDate.toLocaleTimeString();
  const getValue = (event) => {
    setData(event.target.value);
    setOnEnter(false);
  }
  const handle = (event) => {
    if (event.charCode === 13) {
      setOnEnter(true)
    }
  }
  return (
    <center>
      <input type="text" onChange={getValue} onKeyPress={handle.bind(this)} />
      <div>
        {onEnter ?
          <div>
            <h3>{data}</h3>
            <h6>{time}</h6>
            <h6>{dt}</h6>
          </div> : null}
      </div>
    </center>
  )
}
 
export default DateTime;