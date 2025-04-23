import React, { useState } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import "./apishow-dark.css";

export default function ShowApiData() {
  // --- CORE STATE ---
  const [method, setMethod]     = useState("GET");
  const [apiUrl, setApiUrl]     = useState("");
  const [jsonBody, setJsonBody] = useState("");
  const [params, setParams]     = useState([{ key: "", value: "" }]);
  const [headers, setHeaders]   = useState([{ key: "", value: "" }]);
  const [auth, setAuth]         = useState({ type: "None", token: "" });
  const [preScript, setPreScript]   = useState("");
  const [testScript, setTestScript] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState("");

  // --- TABS STATE ---
  const tabs = ["Params","Authorization","Headers","Body","Scripts"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // --- HELPERS ---
  const updateKV = (list, setList, idx, field, val) => {
    const copy = [...list];
    copy[idx][field] = val;
    setList(copy);
  };
  const addRow = (list, setList) => setList([...list, { key:"", value:"" }]);

  const submitHandler = async () => {
    setError(""); setApiResponse(null);

    // Pre‐request script
    if (preScript.trim()) {
      try {
        // eslint-disable-next-line no-new-func
        new Function(
          "method","url","params","headers","body",
          preScript
        )(method, apiUrl, params, headers, jsonBody);
      } catch(e){ console.warn(e) }
    }

    // Build params & headers objects
    const paramsObj = params.reduce((o,{key,value})=> {
      if (key) o[key] = value; return o;
    }, {});
    const headersObj = headers.reduce((o,{key,value})=> {
      if (key) o[key] = value; return o;
    }, {});
    if (auth.type==="Bearer" && auth.token) {
      headersObj["Authorization"] = `Bearer ${auth.token}`;
    }
    if (auth.type==="Basic" && auth.token) {
      headersObj["Authorization"] = `Basic ${btoa(auth.token)}`;
    }

    // Parse JSON body
    let data = null;
    if (jsonBody.trim()) {
      try { data = JSON.parse(jsonBody) }
      catch { return setError("Invalid JSON body") }
    }

    // Fire Axios
    try {
      const res = await axios({ method, url: apiUrl, params: paramsObj, headers: headersObj, ...(data && { data }) });
      setApiResponse(res);

      // Post‐response (test) script
      if (testScript.trim()) {
        try {
          // eslint-disable-next-line no-new-func
          new Function("response", testScript)(res);
        } catch(e){ console.warn(e) }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="api-tester-dark">
      <h1>API Tester</h1>

      {/* URL & Method */}
      <div className="controls-dark">
        <input
          className="url-input-dark"
          placeholder="Enter API URL..."
          value={apiUrl}
          onChange={e=>setApiUrl(e.target.value)}
        />
        <select
          className="method-select-dark"
          value={method}
          onChange={e=>setMethod(e.target.value)}
        >
          {["GET","POST","PUT","PATCH","DELETE"].map(m=>(
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Tab Buttons */}
      <div className="tab-nav">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={()=>setActiveTab(tab)}
            className={activeTab===tab ? "tab-active" : ""}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab==="Params" && (
        <div className="tab-panel">
          {params.map((p,i)=>
            <div key={i} className="kv-row">
              <input
                placeholder="Key" value={p.key}
                onChange={e=>updateKV(params,setParams,i,"key",e.target.value)}
              />
              <input
                placeholder="Value" value={p.value}
                onChange={e=>updateKV(params,setParams,i,"value",e.target.value)}
              />
            </div>
          )}
          <button className="add-row-btn" onClick={()=>addRow(params,setParams)}>
            + Add Param
          </button>
        </div>
      )}

      {activeTab==="Authorization" && (
        <div className="tab-panel">
          <select
            value={auth.type}
            onChange={e=>setAuth({ ...auth, type: e.target.value })}
          >
            {["None","Bearer","Basic"].map(t=>(
              <option key={t}>{t}</option>
            ))}
          </select>
          {auth.type!=="None" &&
            <input
              type={auth.type==="Basic"?"text":"password"}
              placeholder={auth.type==="Basic"?"user:pass":"Bearer token"}
              value={auth.token}
              onChange={e=>setAuth({ ...auth, token: e.target.value })}
            />
          }
        </div>
      )}

      {activeTab==="Headers" && (
        <div className="tab-panel">
          {headers.map((h,i)=>
            <div key={i} className="kv-row">
              <input
                placeholder="Key" value={h.key}
                onChange={e=>updateKV(headers,setHeaders,i,"key",e.target.value)}
              />
              <input
                placeholder="Value" value={h.value}
                onChange={e=>updateKV(headers,setHeaders,i,"value",e.target.value)}
              />
            </div>
          )}
          <button className="add-row-btn" onClick={()=>addRow(headers,setHeaders)}>
            + Add Header
          </button>
        </div>
      )}

      {activeTab==="Body" && (
        <div className="tab-panel">
          <textarea
            className="body-input-dark"
            placeholder="Request Body (JSON)"
            value={jsonBody}
            onChange={e=>setJsonBody(e.target.value)}
          />
        </div>
      )}

      {activeTab==="Scripts" && (
        <div className="tab-panel">
          <h4>Pre-Request Script</h4>
          <textarea
            className="script-input"
            placeholder="// run before request"
            value={preScript}
            onChange={e=>setPreScript(e.target.value)}
          />
          <h4>Test Script</h4>
          <textarea
            className="script-input"
            placeholder="// run after response"
            value={testScript}
            onChange={e=>setTestScript(e.target.value)}
          />
        </div>
      )}

      {/* Send Button */}
      <button className="send-btn-dark" onClick={submitHandler}>
        Send Request
      </button>

      {/* Response */}
      <div className="response-dark">
        {error && <div className="error-dark">{error}</div>}
        {apiResponse && <>
          <h2>Response</h2>
          <div className="json-response-dark">
            <ReactJson
              src={{
                status: apiResponse.status,
                headers: apiResponse.headers,
                data: apiResponse.data
              }}
              theme="monokai"
              collapsed={2}
              name={false}
              enableClipboard={false}
            />
          </div>
        </>}
      </div>
    </div>
  );
}
