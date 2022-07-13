import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineSearch, AiOutlineFolder,  } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdOutlineKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import classNames from 'classnames';
import axios from 'axios'
import listenForOutsideClicks from './utils/listenForOutsideClicks';

import FolderPopup from './components/FolderPopup';
import NavBar from './components/Navbar';
import LinkPopup from './components/LinkPopup';
import SideBar2 from './components/Sidebar2';
import Viewport from './components/Viewport';
import Alert from './components/Alert';

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
  const [searchQuery, setSearchQuery] = useState("")
  const [Flistening, setFListening] = useState(false);
  const [Llistening, setLListening] = useState(false);
  const [curIdDragging, setCurIdDragging] = useState(-1);
  const [msg, setAlertMsg] = useState("");
  
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
    setCollapsed(tmpCollapsed);
  }

  useEffect( () => {
    fetchAll();
  }, [])

  useEffect( ()=> {
    if(folderPopupOpen){
      setFListening(false);
    } else setFListening(true);
  }, [folderPopupOpen])

  useEffect( ()=> {
    setLListening(!linkPopupOpen)
  }, [linkPopupOpen])

  return (
    <div>
      {/* <div className="resize cursor-sw-resize bg-pink-400">
        REsize me
      </div> */}
      <NavBar optionsOpen={optionsOpen} setOptionsOpen={setOptionsOpen} setFolderPopupOpen={setFolderPopupOpen} setLinkPopupOpen={setLinkPopupOpen}
      searchQuery={searchQuery} setSearchQuery={setSearchQuery} curId={curId} fetchAll={fetchAll}/>
      
      <Alert msg={msg} setAlertMsg={setAlertMsg}/>

      {
        folderPopupOpen && <FolderPopup setFolderPopupOpen={setFolderPopupOpen} curId={curId} setFiles={setFiles} files={files}
        Flistening={Flistening} setFListening={setFListening} fetchAll={fetchAll}/>
        // Flistening kinda redundant cuz is just folderPopupOpen
      }
      {
        linkPopupOpen && <LinkPopup setLinkPopupOpen={setLinkPopupOpen} curId={curId} setFiles={setFiles}
        listening={Llistening} setListening={setLListening} fetchAll={fetchAll}
        // listening={!linkPopupOpen} setListening={setLinkPopupOpen} this part doesn't seem too work bc too fast and registers click already?
        />
      }
      
      <div className="fixed min-w-fit h-screen resize cursor-e-resize">
        <SideBar2 files={files} curId={curId} setCurID={setCurID} collapsed={collapsed} setCollapsed={setCollapsed} fetchAll={fetchAll}
        curIdDragging={curIdDragging} setCurIdDragging={setCurIdDragging}
        />
      </div>
      
      {/* <div className="absolute left-60 rounded-xl right-10 mr-10 shadow-xl border-[1px] border-gray-200 max-w-5xl"> */}
      <div className="flex flex-col ml-60 w-screen absolute justify-center align-middle shadow-xl border-[1px] border-gray-200 max-w-5xl">
        <Viewport content={files.find( x => x.id === curId)} files={files} curId={curId} setCurID={setCurID} collapsed={collapsed} setCollapsed={setCollapsed}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} fetchAll={fetchAll}
        curIdDragging={curIdDragging} setCurIdDragging={setCurIdDragging}
        msg={msg} setAlertMsg={setAlertMsg}
        />
      </div>
    </div>
  );
}

export default App;
