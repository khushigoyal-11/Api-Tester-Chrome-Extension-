import axios from "axios";
import React, { useState } from "react";
import ReactJson from "react-json-view";
import "../apishow.css";
import Footer from "../footer/Footer";

const ShowApiData = () => {
  const [method, setMethod] = useState("GET");
  const [apiUrl, setApiUrl] = useState();
  const [apiResponse, setApiResponse] = useState({});
  const [jsonData, setJsonData] = useState({});
  const [error, setError] = useState();
  const [jsonError, setJsonError] = useState("");
  const [headerInputs, setHeaderInputs] = useState({
    headerKey: "Accept",
    headerValue: "*/*",
  });

  // input handler to set header values
  const headerInputHandler = (e) => {
    setHeaderInputs({ ...headerInputs, [e.target.name]: e.target.value });
  };

  // JSON input handler to set json data values
  const jsonDataHandler = (e) => {
    try {
      setJsonData(e.target.value);
      JSON.parse(e.target.value);
      setJsonError("");
    } catch (e) {
      setJsonError("Error in JSON format");
    }
  };

  // function which do api call of respective methods, like GET, POST & DELETE
  const apiCallHandler = async () => {
    var keyHead = headerInputs.headerKey || "Accept";
    var value = headerInputs.headerValue || "*/*";
    if (method === "GET") {
      try {
        const res = await axios.get(apiUrl, {
          headers: { [keyHead]: value },
        });

        setApiResponse(res);
      } catch (error) {
        setError(error.message);
      }
    } else if (method === "POST") {
      try {
        const res = await axios.post(apiUrl, jsonData, {
          headers: { [keyHead]: value },
        });

        setApiResponse(res);
      } catch (error) {
        setError(error.message);
      }
    } else if (method === "DELETE") {
      try {
        const res = await axios.delete(apiUrl, jsonData, {
          headers: { [keyHead]: value },
        });

        setApiResponse(res);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // submit handler to trigger apicallhandler
  const submitHandler = () => {
    setError("");
    apiCallHandler();
  };

  return (
    <div>
      <div className='get-api-data'>
        <select
          onChange={(e) => setMethod(e.target.value)}
          placeholder='Select method'>
          select method
          <option>GET</option>
          <option>POST</option>
          <option>DELETE</option>
        </select>
        <input
          placeholder='ENTER YOUR API'
          onChange={(e) => setApiUrl(e.target.value)}
        />
        <button onClick={submitHandler}>Submit</button>
      </div>
      <div className='header'>
        <div className='header-container'>
          <input
            type='text'
            placeholder='header key'
            name='headerKey'
            value={headerInputs.headerKey}
            onChange={headerInputHandler}
          />
          <input
            type='text'
            name='headerValue'
            value={headerInputs.headerValue}
            placeholder='header value'
            onChange={headerInputHandler}
          />
        </div>
      </div>
      <div className='body-sec'>
        <textarea
          onChange={jsonDataHandler}
          placeholder='Enter Data in JSON format'></textarea>
        <div className='json-err'>{jsonError}</div>
      </div>
      <div className='response-cont'>
        {error ? (
          error
        ) : apiResponse === undefined ? (
          <h2>Response is undefined</h2>
        ) : (
          <>
            <div className='response-data-sec'>
              <h2>Headers :</h2>
              <div className='json-response'>
                <ReactJson
                  src={apiResponse.headers}
                  theme={"parasio"}
                  collapsed={2}
                  collapseStringsAfterLength={10}
                />
              </div>
            </div>
            <div className='response-data-sec'>
              <h2>Data :</h2>
              <div className='json-response'>
                <ReactJson
                  src={apiResponse.data}
                  theme={"parasio"}
                  collapsed={2}
                  collapseStringsAfterLength={10}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShowApiData;
