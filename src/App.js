import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import classNames from 'classnames';

/*
proprties of a file
 - names/title
 - depth
 - par_id
 - id
 - array of child_id
 - type
 - link if bookmark
*/

function App() {

  const [files, setFiles] = useState([
    {names:"root", depth:"ml-0", par_id:0, id:1, child_id:[2,3]}, 
    {names:"test", depth:"ml-5", par_id:1, id:2, child_id:[]},
    {names:"math", depth:"ml-5", par_id:1, id:3, child_id:[]}]);
  const [curId, setCurID] = useState(1);
  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <div>
      <NavBar optionsOpen={optionsOpen} setOptionsOpen={setOptionsOpen}/>

      <div className="fixed w-32 h-screen">
        {
          files.map( (x,ind) => {
            return <div className="hover:bg-gray-200 rounded-r-full">
              <File key={ind} val={x} curId={curId} setCurID={setCurID}/>
            </div>
          })
        }
      </div>

      <Viewport content={files.find( x => x.id === curId)} files={files}/>
      
    </div>
  );
}

function NavBar({optionsOpen, setOptionsOpen}) {
  const optionsClicked = () => {
    setOptionsOpen(!optionsOpen);

  }
  const optionsFocusedOut = (e) => {
    console.log("OUT");
    setOptionsOpen(false)
  }
  const newBookmark = () => {
    //need POPUP
    //setFiles, update to db
  }
  const newFolder = () => {
    //need POPUP
  }

  return (
    <div className="flex h-10 mt-1 mb-3 items-center">
      <img src={require('./img/chromeIcon.png')} className="h-7 w-7 mx-4"></img>
      <div className="font-semibold text-lg font-mono">
        Bookmarks
      </div>
      <div className="border-gray-300 rounded-3xl flex flex-1 ml-8 z-10 h-full bg-gray-100 
            text-sm mx-3 items-center">
        <AiOutlineSearch className="h-6 w-6 hover:bg-gray-300 rounded-full ml-2"/>
        <input className="pl-3 focus:outline-none bg-gray-100 w-full"
          placeholder="Search bookmarks"
          type="search"/>
      </div>
      <div className="h-8 w-8 mx-3 hover:bg-gray-300 rounded-full align-middle" onClick={optionsClicked} onBlur={optionsFocusedOut}>
        {!optionsOpen && <BsThreeDotsVertical className="hover:cursor-pointer h-6 w-6 mx-auto align-middle" onBlur={optionsFocusedOut}/>
        }
      </div>
      {optionsOpen && <div className="bg-green-300 fixed top-5 right-5 h-32 w-44 z-10">
          <button onClick={newBookmark}> Add new bookmark</button> 
          <button onClick={newFolder}> Add new folder</button> 
        </div> 
      }
    </div>
  )
}

function File({val, curId, setCurID}) {

  const handleClick = () => {
    setCurID(val.id);
  }

  return <div className={val.depth}>
    <div className={classNames('hover:cursor-pointer rounded-r-full h-10', 
      {
        'bg-blue-200':val.id===curId
      }
    )} onClick={handleClick}>
      {val.names}
    </div>
  </div>
}

function Viewport({content,files}){
  console.log(content);
  //files search for id
  return (
    <div className="bg-red-300 inline-block ml-36 mr-10">
      <div className="border-blue-300 w-screen h-40 border-4 rounded-lg">
        {content.child_id.map( (x,ind) => {
          const tmp = files.find(y => y.id===x);
          return <Card key={ind} cardID={x} cardType="DOC" cardLink="TODO" cardName={tmp.names}/>
        })}
      </div>
    </div>
  )
}

function Card({cardID,cardType,cardLink,cardName}){
  return <div>
    {
      cardType==="DOC" && "IS DOC"
    }
    {cardName}
    {cardType}
    {cardLink}
  </div>
}

export default App;
