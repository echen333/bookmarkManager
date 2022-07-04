import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'

function App() {

  const [files, setFiles] = useState([
    {names:"root", depth:"ml-0", par_id:0, id:1, child_id:[2]}, 
    {names:"test", depth:"ml-5", par_id:1, id:2, child_id:[]}]);
  const [curId, setCurID] = useState(1);
  // const [files, setFiles] = useState([{names:"root", depth:0}, "test"]);

  return (
    <div>
      <div className="flex h-10 mt-1 mb-3 items-center">
        <img src={require('./img/chromeIcon.png')} className="h-7 w-7 mx-4"></img>
        <div className="font-semibold text-lg font-mono">
          Bookmarks
        </div>
        <div className="border-gray-300 rounded-3xl flex flex-1 ml-8 z-10 h-full bg-gray-100 
             text-sm mx-3 ">
          <AiOutlineSearch className="h-6 w-6 hover:bg-gray-300 rounded-full items-center"/>
          <input className="pl-3 focus:outline-none bg-gray-100"
            placeholder="Search bookmarks"
            type="search"/>
        </div>
        <BsThreeDotsVertical className="mx-3 hover:cursor-pointer hover:bg-gray-300 rounded-full h-6 w-6" size={20}/>
      </div>

      <div className="fixed w-32 h-screen">
        {
          files.map( (x,ind) => {
            return <File key={ind} val={x}/>
          })
        }
      </div>

      <Viewport content={files.find( x => x.id === curId)}/>
      
    </div>
  );
}

function File({val}) {

  const handleClick = () => {

  }

  return <div className={val.depth}>
    <div className="bg-orange-200 hover:bg-blue-300 rounded-r-xl h-10">
      {val.names}
    </div>
  </div>
}

function Viewport({content}){
  console.log(content);
  //files search for id
  return (
    <div className="bg-red-300 inline-block ml-36 mr-10">
      <div className="border-blue-300 w-screen h-40 border-4 rounded-lg">
        {content.child_id.map( x => {
          return <Card cardID={x}/>
        })}
      </div>
    </div>
  )
}

function Card({cardID}){
  return <div>
    HI
  </div>
}
export default App;
