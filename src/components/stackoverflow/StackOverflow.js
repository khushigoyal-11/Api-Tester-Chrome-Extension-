import React, { useState, useEffect } from "react";
import Footer from "../footer/Footer";
import Data from "./Data";
const StackOverflow = () => {
  const [linkData, setLinkData] = useState();
  const [timeData, setTimeData] = useState(new Date());
  const [proTips, setProtips] = useState(Data[Math.floor(Math.random() * 6)]);

  useEffect(() => {
    let timer = setInterval(() => setTimeData(new Date()), 1000);
    setProtips(Data[Math.floor(Math.random() * 6)]);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  const handelData = () => {
    let url = "http://stackoverflow.com/search?q=" + linkData;
    window.open(url, "_blank");
  };
  return (
    <>
      <div className='protips'>
        <div className='tips'>Protip VSCode: </div>
        <b>{proTips}</b>
      </div>
      <div className='time' aria-hidden='true'>
        ❄{timeData.toLocaleString().slice(0, 8)}❄
        <br />
        {timeData.toLocaleString().slice(9)}
        <div class='snowflake'>❅</div>
        <div class='snowflake'>❅</div>
        <div class='snowflake'>❆</div>
        <div class='snowflake'>❄</div>
        <div class='snowflake'>❅</div>
        <div class='snowflake'>❆</div>
        <div class='snowflake'>❄</div>
        <div class='snowflake'>❅</div>
        <div class='snowflake'>❆</div>
        <div class='snowflake'>❄</div>
      </div>
      <div className='stackoverflow-cont'>
        <input
          type='text'
          onChange={(e) => setLinkData(e.target.value)}
          placeholder='Enter Your Errors Here'
        />
        <button onClick={handelData}>search</button>
      </div>
      <div className='stack-img'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Stack_Overflow_logo.svg/1280px-Stack_Overflow_logo.svg.png'
          alt='stack'
        />
      </div>
      <Footer />
    </>
  );
};

export default StackOverflow;
