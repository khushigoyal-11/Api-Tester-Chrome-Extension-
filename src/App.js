import "./App.css";
import { useState } from "react";
import ShowApiData from "./components/showApiData/ShowApiData";
import StackOverflow from "./components/stackoverflow/StackOverflow";
function App() {
  const [istackOverflow, setIsStackOverflow] = useState(false);
  return (
    <div className='App'>
      <div className='routes-cont'>
        <div
          className='route'
          onClick={() => setIsStackOverflow(false)}
          style={{
            backgroundColor: istackOverflow ? "#fff" : "#189AB4",
            color: !istackOverflow ? "#fff" : "#189AB4",
          }}>
          API
        </div>
        <div
          className='route sec-route'
          onClick={() => setIsStackOverflow(true)}
          style={{
            backgroundColor: !istackOverflow ? "#fff" : "#189AB4",
            color: istackOverflow ? "#fff" : "#189AB4",
          }}>
          StackOverflow
        </div>
      </div>
      {istackOverflow ? <StackOverflow /> : <ShowApiData />}
    </div>
  );
}

export default App;
