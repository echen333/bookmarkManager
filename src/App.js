import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {

  const [files, setFiles] = useState([
    {names:"root", depth:"ml-0", par_id:0, id:1, child_id:[2]}, 
    {names:"test", depth:"ml-5", par_id:1, id:2, child_id:[]}]);
  // const [files, setFiles] = useState([{names:"root", depth:0}, "test"]);

  return (
    <div>
      <div className="flex h-10 mt-1 mb-3 border-blue-400 border-solid border-w border-b-4">
        <div className="bg-pink-300">
          Bookmarks
        </div>
        <input className="border-gray-300 rounded-3xl flex-1 ml-8 bg-fuchsia-400" type="search"/>
        <button>Press</button>
      </div>

      <div className="flex flex-col w-20 bg-slate-400 h-screen">
        Bookmarks
        {
          files.map( (x,ind) => {
            return <File key={ind} val={x}/>
          })
        }
      </div>

      <div className="bg-red-300 inline-block">
        Hello
      </div>
    </div>
  );
}

function File({val}) {

  const handleClick = () => {

  }

  return <div className={val.depth}>
    <div className="bg-orange-200">
      {val.names}
    </div>
  </div>
}

export default App;
