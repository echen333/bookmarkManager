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
  const [collapsed, setCollapsed] = useState([])

  useEffect( () => {
    async function fetchAll() {
      const ret = await axios.get('/polls/getAll');
      console.log(ret);
      setFiles(ret.data)
      
      let tmpCollapsed = [];
        ret.data.forEach( x => {
          if(x.type==="Folder" && !collapsed.find(y => y.id===x.id)){
            tmpCollapsed.push({"id":x.id, "isCollapsed": false});
          }
        })
      console.log("TMPCOLLAPSED", tmpCollapsed);
      setCollapsed(tmpCollapsed);
    }
    fetchAll();
    
    
  }, [])
  
  return (
    <div>
      {/* <div className="resize cursor-sw-resize bg-pink-400">
        REsize me
      </div> */}
      <NavBar optionsOpen={optionsOpen} setOptionsOpen={setOptionsOpen} setFolderPopupOpen={setFolderPopupOpen} setLinkPopupOpen={setLinkPopupOpen}/>
      
      {
        folderPopupOpen && <FolderPopup setFolderPopupOpen={setFolderPopupOpen} curId={curId} setFiles={setFiles} files={files}/>
      }
      {
        linkPopupOpen && <LinkPopup setLinkPopupOpen={setLinkPopupOpen} curId={curId} setFiles={setFiles}/>
      }

      <SideBar2 files={files} curId={curId} setCurID={setCurID} collapsed={collapsed} setCollapsed={setCollapsed}/>
      
      <div className="absolute left-60 rounded-xl right-10 mr-10 shadow-xl border-[1px] border-gray-200 overflow-hidden">
        <Viewport content={files.find( x => x.id === curId)} files={files} setCurID={setCurID} collapsed={collapsed} setCollapsed={setCollapsed}/>
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
    const ret = await axios.post('/polls/addFolder/', bodyFormData);
    // TODO: setFiles( files => [...files, obj])
  }
  const CancelButton = () => {
    setFolderPopupOpen(false);
  }
  const nameChange = (e) => {
    setFormName(e.target.value);
  }
  return (
    <div className="bg-cover bg-gray-800 z-40 opacity-70 absolute left-0 right-0 top-0 bottom-0">
      <div className="bg-white absolute w-[30rem] h-48 left-2/4 top-2/4 rounded-lg z-50 -translate-x-1/2 -translate-y-1/2">
        <div className="ml-10 font-semibold mt-6 mb-3"> Add Folder
        </div>
        <div className="ml-10 mb-8">
          <div className="text-[10px] font-bold text-gray-700 mb-2">
            Name
          </div>
          <div>
            <input className="bg-gray-200 border-0 focus:outline-none rounded-sm pl-2 h-7 w-11/12" value={formName} onChange={nameChange}></input>
          </div>
        </div>
        <div className="absolute bottom-0 right-0">
          <button onClick={CancelButton} className="bg-white border-gray-300 border-[1px] rounded-md w-16 h-8 mr-4 text-blue-600 font-bold text-sm">Cancel</button>
          <button onClick={SaveButton} className="bg-blue-600 rounded-md w-16 h-8 mr-4 mb-4 text-white font-semibold text-sm">Save</button>
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
      <div className="bg-white absolute w-[30rem] h-72 left-2/4 top-2/4 rounded-lg z-50 -translate-x-1/2 -translate-y-1/2">
        <div className="ml-10 font-semibold mt-6 mb-3"> Add Bookmark
        </div>
        <div className="ml-10 mb-8">
          <div className="text-[10px] font-bold text-gray-700 mb-2">
            Name
          </div>
          <div>
            <input className="bg-gray-200 border-0 focus:outline-none rounded-sm pl-2 h-7 w-11/12" value={formName} onChange={nameChange}></input>
          </div>
        </div>
        <div className="ml-10">
        <div className="text-[10px] font-bold text-gray-700 mb-2">
            URL
          </div>
          <div>
            <input className="bg-gray-200 border-0 focus:outline-none rounded-sm pl-2 h-7 w-11/12" value={formURL} onChange={URLChange}></input>
          </div>
        </div>
        <div className="absolute bottom-0 right-0">
          <button onClick={CancelButton} className="bg-white border-gray-300 border-[1px] rounded-md w-16 h-8 mr-4 text-blue-600 font-bold text-sm">Cancel</button>
          <button onClick={SaveButton} className="bg-blue-600 rounded-md w-16 h-8 mr-4 mb-4 text-white font-semibold text-sm">Save</button>
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
    setOptionsOpen(false)
  }
  const newBookmark = () => {
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
      {optionsOpen && <div className="bg-green-300 absolute top-3 right-3 w-40 z-10 flex flex-col justify-start text-sm">
          <div className="ml-5 mt-3">
            <button onClick={newBookmark}> Add new bookmark</button> 
          </div>
          <div className="ml-5 mb-3">
            <button onClick={newFolder}> Add new folder</button> 
          </div>
        </div> 
      }
    </div>
  )
}

function SideBar2({files, curId, setCurID, dfsNode=1, collapsed, setCollapsed}) {
  let tmp = files.find(x => x.id===dfsNode);
  let foldersBel=[]
  if(tmp){
    let childArr = tmp.child_id.split(',').slice(1);
    childArr.forEach( x => {
      let z = files.find(y => y.id === parseInt(x))
      if (z && z.type=="Folder"){
        foldersBel.push(z)
      }
    })
  }

  return (
    <div className="fixed w-52 h-screen">
        {
          foldersBel.map( (x,ind) => {
            return <div>
              <div className={classNames("hover:bg-gray-200 rounded-r-full",
              {
                // TODO: should be taking from child if child hovered
              'bg-blue-200': x.id===curId,
              'hover: bg-blue-200': x.id===curId
              }
              )}>
                <File key={ind} val={x} curId={curId} setCurID={setCurID} collapsed={collapsed} setCollapsed={setCollapsed}/>
              </div>
              { collapsed && collapsed.find(y=> y.id===x.id) && 
                !collapsed.find(y=> y.id===x.id).isCollapsed?
                <SideBar2 files={files} curId={curId} setCurID={setCurID} dfsNode={x.id} collapsed={collapsed} setCollapsed={setCollapsed}/>:
                <div>
                </div>
              }
            </div>
          })
        }
      </div>
  )
}
function File({val, curId, setCurID, collapsed, setCollapsed}) {
  const handleClick = () => {
    setCurID(val.id);
  }
  const handleCollapseClick = () => {
    let ind = collapsed.findIndex(x => x.id === val.id);
    if(ind){
      let tmp = [...collapsed];
      let OBJ=collapsed[ind];
      console.log(val, ind, OBJ);
      tmp[ind] = {"id":val.id, "isCollapsed":!OBJ.isCollapsed}
      console.log("TMP", tmp);
      setCollapsed(tmp);
    }
  }
  let TMP=false;
  if(collapsed){
    let TMP2=collapsed.find(x => x.id===val.id)
    if(TMP2){
      TMP = TMP2.isCollapsed;
    }
    console.log("TMP",TMP);
  }
  
  return <div > 
    <div className={classNames('hover:cursor-pointer rounded-r-full h-10', 
      {
        'bg-blue-200':val.id===curId,
        'hover: bg-blue-200':val.id===curId,
        [`pl-${val.depth}`]: true
      }
    )} onClick={handleClick}>
      <div className="flex">
        {val.type=="Folder" && 
            <div className="flex mt-2 mr-2">
              <div className="rounded-full hover:bg-gray-500 py-0.5" onClick={handleCollapseClick}>
                { !TMP ? <MdKeyboardArrowDown className="h-6 w-6 mr-1"/>:
                <MdOutlineKeyboardArrowRight className="h-6 w-6 mr-1"/>
                }
              </div>
              <AiOutlineFolder className="h-6 w-6"/>
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
  const handleOptionsClick = () => {
    // setCardOptionsOpen(true);
  }
  const handleOpenNewTabClick = () => {
    window.open(files.find(x => x.id===parseInt(cardID)).link);
  }
  const handleDeleteBookmarkClick = async () => {
    // await axios.delete('/')
  }
  const handleEditBookmarkClick = () => {
  }
  const handleOpenNewWindowClick = () => {
    window.open(files.find(x => x.id===parseInt(cardID)).link,"_blank", "fullscreen=1",
    "location=1",
    "titlebar=1",
    "status=1",
    "menubar=1",);
  }

  let parsed = parseInt(cardID);
  if(isNaN(parsed)){
    return <div/>
  }
  let tmp = files.find( x => x.id === parsed)
  if(tmp === undefined){
    console.log("IS UNDEFINED");
  } else {
    return <div onClick={handleClick} className={classNames("cursor-pointer py-2 pl-6 flex",
      {
        'bg-blue-200': parseInt(cardID) === focusedCard
      })}>
      { tmp.type==="Folder"?
        <AiOutlineFolder className="h-6 w-6 mr-4"/>:
        <img src='./img/chromeIcon'/>
      }
      {tmp.title}
      <div className="absolute right-4 mt-1">
        <div className="hover:bg-gray-200 absolute right-4 mt-1 rounded-full">
          <BsThreeDotsVertical />
        </div>
        { false && 
          <div className="bg-green-300 relative top-0 right-3 w-40 z-10 flex flex-col justify-start text-sm">
            <div className="ml-5 mt-3">
              <button onClick={handleOpenNewTabClick}> Open in New Tab</button> 
            </div>
            <div className="ml-5 mb-3">
              <button onClick={handleOpenNewWindowClick}> Open in New Window</button> 
            </div>
            <div className="ml-5 mb-3">
              <button onClick={handleEditBookmarkClick}>Edit Bookmark</button> 
            </div>
            <div className="ml-5 mb-3">
              <button onClick={handleDeleteBookmarkClick}>Delete Bookmark</button> 
            </div>
        </div> 
        }
      </div>
    </div>
  }
}

export default App;
