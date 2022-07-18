import axios from 'axios'
import { AiOutlineSearch} from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import React, { useState, useEffect, useRef } from 'react';
import listenForOutsideClicks from '../utils/listenForOutsideClicks';

function NavBar({optionsOpen, setOptionsOpen, setFolderPopupOpen, setLinkPopupOpen, searchQuery, setSearchQuery, curId, fetchAll}) {

    const menuRef = useRef(null);
    const [optionsListening, setOptionsListening] = useState(false);

    // useEffect(listenForOutsideClicks(
    //   optionsListening,
    //   setOptionsListening,
    //   menuRef,
    //   setOptionsOpen,
    // ));

    useEffect( ()=>{
      console.log("SET LISTENING", optionsOpen);
      if(optionsOpen){
        setOptionsListening(false);
      } else {
        setOptionsListening(true)
      } 
    }, [optionsOpen, setOptionsOpen])
    const optionsClicked = async() => {
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
    const searchChange = (e) => {
      setSearchQuery(e.target.value)
    }
    const sortChildren = async () => {
      await axios.get(`/polls/${curId}/sorts`);
      console.log("SORTED");
      fetchAll();
    }
    const openHelp = () => {
      window.open("https://support.google.com/chrome/answer/188842?visit_id=637932814270745867-3652172056&p=bookmarks&rd=1")
      setOptionsOpen(false)
    }

    return (
      <div className="flex h-10 mt-1 mb-3 justify-center align-middle">
        <img src={require('../img/chromeIcon.png')} alt="Chrome Icon" className="h-6 w-6 m-auto mx-4 p-0 "></img>
        <div className="text-2xl font-sans font-semibold m-auto">
          Bookmarks
        </div>
        <div className="flex justify-center align-middle flex-1">
          <div className="border-gray-300 rounded-3xl flex flex-1 z-10 h-full bg-gray-100
                text-sm items-center align-middle max-w-xl justify-center shrink-0 grow-0">
            <AiOutlineSearch className="h-6 w-6 hover:bg-gray-300 hover: cursor-pointer rounded-full ml-2"/>
            <input className="pl-3 focus:outline-none bg-gray-100 shrink-0 grow-0"
              placeholder="Search bookmarks"
              type="search" onChange={searchChange} value={searchQuery}/>
          </div>
        </div>
        <div ref={menuRef}>
          {
            !optionsOpen ? 
            <div className="h-8 w-8 m-auto mr-2 hover:bg-gray-300 rounded-full flex justify-center align-middle" onClick={optionsClicked} onBlur={optionsFocusedOut}>
              {!optionsOpen && <BsThreeDotsVertical className="hover:cursor-pointer m-auto" onBlur={optionsFocusedOut}/>
              }
            </div> 
            :
            <div className="shadow-2xl border-gray-100 border-[1px] rounded-md bg-white absolute top-2 right-3 w-40 z-10 flex flex-col justify-start text-sm">

            <div className="pl-5 mt-2 py-1.5 hover:bg-gray-300">
              <button onClick={sortChildren}> Sort by name</button> 
            </div>
            <div className="pl-5 py-1.5 hover:bg-gray-300">
              <button onClick={newBookmark}> Add new bookmark</button> 
            </div>
            <div className="pl-5 py-1.5 hover:bg-gray-300">
              <button onClick={newFolder}> Add new folder</button> 
            </div>
            <div className="pl-5 py-1.5 hover:bg-gray-300">
                <a
            href={require('../utils/bookmarks_7_12_22.txt')}
            download
            >Export Bookmarks</a>
              {/* <button onClick={exportBookmarks}> Export Bookmarks</button>  */}
            </div>
            <div className="pl-5 mb-2 py-1.5 hover:bg-gray-300">
              <button onClick={openHelp}> Help Center</button> 
            </div>
           </div> 
          }
        </div>
      </div>
    )
}

export default NavBar;