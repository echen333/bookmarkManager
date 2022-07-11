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
 - title
 - depth
 - par_id
 - id
 - array of child_id
 - type
 - link if bookmark
*/

function App() {

  const [files, setFiles] = useState([]);
  const [curId, setCurID] = useState(1);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [linkPopupOpen, setLinkPopupOpen] = useState(false);
  const [folderPopupOpen, setFolderPopupOpen] = useState(false);

  useEffect( () => {
    async function fetchAll() {
      const ret = await axios.get('/polls/getAll');
      console.log(ret);
      setFiles(ret.data)
    }
    fetchAll();

  }, [])

  return (
    <div>
      <NavBar optionsOpen={optionsOpen} setOptionsOpen={setOptionsOpen} setFolderPopupOpen={setFolderPopupOpen} setLinkPopupOpen={setLinkPopupOpen}/>
      
      {
        folderPopupOpen && <FolderPopup setFolderPopupOpen={setFolderPopupOpen} curId={curId} setFiles={setFiles} files={files}/>
      }
      {
        linkPopupOpen && <LinkPopup setLinkPopupOpen={setLinkPopupOpen} curId={curId} setFiles={setFiles}/>
      }

      <SideBar files={files} curId={curId} setCurID={setCurID}/>
      
      <div className="inline-block ml-36 mr-10 max-w-screen-lg w-screen shadow-2xl">
        <Viewport content={files.find( x => x.id === curId)} files={files} setCurID={setCurID}/>
      </div>


      
    </div>
  );
}

function FolderPopup({setFolderPopupOpen, curId, setFiles, files}) {
    
  const [formName, setFormName] = useState("");

  const SaveButton = async () => {
    setFolderPopupOpen(false);
    var bodyFormData = new FormData();
    bodyFormData.append('title', formName);
    bodyFormData.append('par_id', curId);
    for (var key of bodyFormData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    const ret = await axios.post('/polls/addFolder/', bodyFormData);
    // TODO: setFiles( files => [...files, obj])
    // console.log(files, obj);
    console.log(ret);
  }
  const CancelButton = () => {
    setFolderPopupOpen(false);
  }
  const nameChange = (e) => {
    setFormName(e.target.value);
  }
  return (
    <div className="bg-cover bg-gray-600 z-40 opacity-75 absolute left-0 right-0 top-0 bottom-0">
      <div className="bg-white relative w-72 h-56 left-2/4 top-2/4 rounded-lg z-50">
        <div className="ml-10 font-bold"> Add Folder
        </div>
        <div className="ml-10">
          <div className="text-sm">
            Name
          </div>
          <div>
            <input className="bg-gray-200 border-0 focus:outline-none rounded-sm pl-2" value={formName} onChange={nameChange}></input>
          </div>
        </div>
        <div className="absolute bottom-0 right-0">
          <button onClick={CancelButton} className="bg-white border-gray-500 border-2 rounded-lg w-16 h-10 text-blue-600">Cancel</button>
          <button onClick={SaveButton} className="bg-blue-500 rounded-lg w-16 h-10 mr-4 mb-4">Save</button>
        </div>
      </div>
    </div>
  )
}
function LinkPopup({setLinkPopupOpen, curId, files}) {
    
  const [formName, setFormName] = useState("");
  const [formURL, setFormURL] = useState("");

  const SaveButton = async () => {
    setLinkPopupOpen(false);
    var bodyFormData = new FormData();
    let tmp = formURL;
    if(!formURL.includes("http")){
      tmp = "http://"+formURL;
      console.log(tmp);
      setFormURL(tmp);
    }
    bodyFormData.append('link', tmp);
    bodyFormData.append('title', formName);
    bodyFormData.append('par_id', curId);
    for (var key of bodyFormData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    const ret = await axios.post('/polls/addLink/', bodyFormData);
    console.log(ret);
  }
  const CancelButton = () => {
    setLinkPopupOpen(false);
  }
  const nameChange = (e) => {
    setFormName(e.target.value);
  }
  const URLChange = (e) => {
    setFormURL(e.target.value);
  }

  return (
    <div className="bg-cover bg-gray-600 z-40 opacity-75 absolute left-0 right-0 top-0 bottom-0">
      <div className="bg-white relative w-72 h-56 left-2/4 top-2/4 rounded-lg z-50">
        <div className="ml-10 font-bold"> Add Bookmark
        </div>
        <div className="ml-10">
          <div className="text-sm">
            Name
          </div>
          <div>
            <input className="bg-gray-200 border-0 focus:outline-none rounded-sm pl-2" value={formName} onChange={nameChange}></input>
          </div>
        </div>
        <div className="ml-10 text-sm">
          URL
          <div>
            <input className="bg-gray-200 border-0 focus:outline-none rounded-sm pl-2" value={formURL} onChange={URLChange}></input>
          </div>
        </div>
        <div className="absolute bottom-0 right-0">
          <button onClick={CancelButton} className="bg-white border-gray-500 border-2 rounded-lg w-16 h-10 text-blue-600">Cancel</button>
          <button onClick={SaveButton} className="bg-blue-500 rounded-lg w-16 h-10 mr-4 mb-4">Save</button>
        </div>
      </div>
    </div>
  )
}

function NavBar({optionsOpen, setOptionsOpen, setFolderPopupOpen, setLinkPopupOpen}) {
  const optionsClicked = async() => {
    const ret = await axios.get('/polls/1/getBookmark')
    setOptionsOpen(!optionsOpen);
  }
  const optionsFocusedOut = (e) => {
    console.log("OUT");
    setOptionsOpen(false)
  }
  const newBookmark = () => {
    console.log("HEYAA");
    setLinkPopupOpen(true);
    setOptionsOpen(false);
  }
  const newFolder = () => {
    setFolderPopupOpen(true);
    setOptionsOpen(false);
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
          files.filter(x => x.type==="Folder").map( (x,ind) => {
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
          {val.title}
        </div>
      </div>
    </div>
  </div>
}

function Viewport({content,files, setCurID}){

  const [focusedCard, setCardFocus] = useState(-1);

  if(content === undefined){
    return <div></div>
  }
  //files search for id
  let childArr = content.child_id.split(","); 

  var Cards = [];
  childArr.forEach( (ID, ind) => {
    Cards.push( <Card cardID={ID} files={files} setCurID={setCurID} 
      setCardFocus={setCardFocus} focusedCard={focusedCard}/>)
  })

  return Cards;
}

function Card({cardID, files, setCurID, setCardFocus, focusedCard}){

  const handleClick = (e) => {
    setCardFocus(parseInt(cardID));
    if(e.detail>=2){
      const itemSelected = files.find( x => parseInt(cardID) === x.id);
      if (itemSelected && itemSelected.type==="Folder"){
        setCurID(parseInt(cardID));
      } else {
        window.open(itemSelected.link)
      }
    }
  }

  let parsed = parseInt(cardID);
  if(isNaN(parsed)){
    return <div>
    </div>
  }
  let tmp = files.find( x => x.id === parsed)
  
  if(tmp === undefined){
    console.log("AJKLSJDlkjasld");
  } else {
    return <div onClick={handleClick} className={classNames("cursor-pointer",
      {
        'bg-blue-200': parseInt(cardID) === focusedCard
      })}>
      {tmp.title}
    </div>
  }
}

export default App;
