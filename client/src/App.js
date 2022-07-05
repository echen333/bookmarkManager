import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { AiOutlineSearch, AiOutlineFolder,  } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdOutlineKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import classNames from 'classnames';
import axios from 'axios'

/*
properties of a file
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
    {names:"root", depth:"pl-0", par_id:0, id:1, child_id:[2,3], type:"Folder"}, 
    {names:"test", depth:"pl-5", par_id:1, id:2, child_id:[],  type:"Link"},
    {names:"math", depth:"pl-5", par_id:1, id:3, child_id:[],  type:"Link"}]);
  const [curId, setCurID] = useState(1);
  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <div>
      <NavBar optionsOpen={optionsOpen} setOptionsOpen={setOptionsOpen}/>

      <SideBar files={files} curId={curId} setCurID={setCurID}/>
      

      <Viewport content={files.find( x => x.id === curId)} files={files}/>
      
    </div>
  );
}

function NavBar({optionsOpen, setOptionsOpen}) {
  const optionsClicked = async() => {
    const ret = await axios.get('http://localhost:8000')
    console.log(ret);
    // setOptionsOpen(!optionsOpen);
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
        <AiOutlineSearch className="h-6 w-6 hover:bg-gray-300 hover: cursor-pointer rounded-full ml-2"/>
        <input className="pl-3 focus:outline-none bg-gray-100 w-full"
          placeholder="Search bookmarks"
          type="search"/>
      </div>
      <div className="h-8 w-8 mx-3 hover:bg-gray-300 rounded-full" onClick={optionsClicked} onBlur={optionsFocusedOut}>
        {!optionsOpen && <BsThreeDotsVertical className="hover:cursor-pointer h-4 w-4 top-4 right-5 absolute mx-auto" onBlur={optionsFocusedOut}/>
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

function SideBar({files, curId, setCurID}) {
  return (
    <div className="fixed w-32 h-screen">
        {
          files.map( (x,ind) => {
            return <div className={classNames("hover:bg-gray-200 rounded-r-full",
              {
                // TODO: should be taking from child if child hovered
              'bg-blue-200': x.id===curId,
              'hover: bg-blue-200': x.id===curId
              }
            )}>
              <File key={ind} val={x} curId={curId} setCurID={setCurID}/>
            </div>
          })
        }
      </div>
  )
}
function File({val, curId, setCurID}) {

  const handleClick = () => {
    setCurID(val.id);
  }

  return <div > 
    {/* TODO: className={val.depth} */}
    <div className={classNames('hover:cursor-pointer rounded-r-full h-10', 
      {
        'bg-blue-200':val.id===curId,
        'hover: bg-blue-200':val.id===curId,
      }
    )} onClick={handleClick}>
      <div className="flex align-middle">
        {val.type=="Folder" && 
            <div className="inline-block">
              <MdKeyboardArrowDown className="h-6 w-6 mt-2 ml-3 mr-2"/>
              {/* <MdOutlineKeyboardArrowRight/> */}
              <AiOutlineFolder className="h-6 w-6 mt-2 mr-2"/>
            </div>
            }
        
        <div className="pt-2 inline-block">
          {val.names}
        </div>
      </div>
    </div>
  </div>
}

function Viewport({content,files}){
  console.log(content);
  //files search for id
  return (
    <div className="bg-red- inline-block ml-36 mr-10 max-w-screen-lg w-screen shadow-2xl">
      {content.child_id.map( (x,ind) => {
        const tmp = files.find(y => y.id===x);
        return <Card key={ind} cardID={x} cardType="DOC" cardLink="TODO" cardName={tmp.names}/>
      })}
    </div>
  )
}

function Card({cardID,cardType,cardLink,cardName}){
  return <div>
    <img src={require('./img/folder.png')} className="h-5 w-5 inline-block"></img>
    {/* {
      cardType==="DOC" && "IS DOC"
    } */}
    {cardName}
    {/* {cardType}
    {cardLink} */}
    <div className="h-8 w-8 mx-3 hover:bg-gray-300 rounded-full inline-block">
      <BsThreeDotsVertical className="hover:cursor-pointer h-4 w-4 top-2 right-3 relative mx-auto"/>
    </div>
  </div>
}

export default App;
