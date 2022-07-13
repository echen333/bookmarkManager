import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineFolder,  } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import classNames from 'classnames';
import axios from 'axios'
import listenForOutsideClicks from '../utils/listenForOutsideClicks';

function Card({cardID, files, setCurID, setCardFocus, focusedCard, cardOptionsID, setCardOptionsID, cardOptionsOpen, setCardOptionsOpen, fetchAll, ind, len}){

    const menuRef = useRef(null);
    const [cardListening, setCardListening] = useState(false);
  
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
      if(!cardOptionsOpen){
        setCardOptionsOpen(true);
        setCardOptionsID(cardID);
        console.log("HEY", cardID);
      }
    }
    const handleOpenNewTabClick = () => {
      window.open(files.find(x => x.id===parseInt(cardID)).link);
    }
    const handleDeleteBookmarkClick = async () => {
      console.log("DELETING", cardID);
      await axios.get(`/polls/${cardID}/deletes/`)
      fetchAll();
      console.log("DONE FETCHING");
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
    useEffect(listenForOutsideClicks(
      cardListening,
      setCardListening,
      menuRef,
      setCardOptionsOpen,
    ));
    useEffect( () => {
      if(cardOptionsOpen && cardOptionsID===cardID){
        console.log("IM LISTENING", cardID);
        setCardListening(false)
      } else {
        setCardListening(true)
      }
    }, [cardOptionsOpen])
  
    let parsed = parseInt(cardID);
    if(isNaN(parsed)){
      return <div/>
    }
    let tmp = files.find( x => x.id === parsed)
    if(!tmp){
      return <div/>
    }
    let imgStr = tmp.link+"/favicon.ico"
    let imgFound = true;
    if(tmp === undefined){
      console.log("IS UNDEFINED");
    } else {
      return <div onClick={handleClick} className={classNames("cursor-pointer py-2 pl-6 flex",
        {
          'bg-blue-200': parseInt(cardID) === focusedCard,
          'mt-2': ind===0,
          'mb-2': ind===len-1
        })}>
        { tmp.type==="Folder"?
          <AiOutlineFolder className="h-6 w-6 mr-4"/>:
            imgFound?
            <img src={imgStr} className="w-6 h-6 mr-4" />
            :<img src="http://google.com/favicon.ico" className="w-6 h-6 mr-4" />
        }
        {tmp.title}
        {parseInt(cardID) === focusedCard && <div className="ml-4 text-gray-500">
          {tmp.link}
          </div>}
        <div className="absolute right-4 mt-1">
          <div onClick={handleOptionsClick} className="hover:bg-gray-200 absolute right-4 mt-1 rounded-full">
            <BsThreeDotsVertical />
          </div>
          { cardOptionsOpen && cardID===cardOptionsID && 
            <div ref={menuRef} className="shadow-xl border-gray-100 border-[1px] bg-white rounded-sm relative top-0 right-3 w-44 z-10 flex flex-col justify-start text-sm overflow-hidden">
              <div className="pl-5 mt-1 py-1.5 hover:bg-gray-300">
                <button onClick={handleOpenNewTabClick}> Open in New Tab</button> 
              </div>
              <div className="pl-5 py-1.5 hover:bg-gray-300" >
                <button onClick={handleOpenNewWindowClick}> Open in New Window</button> 
              </div>
              <div className="pl-5 py-1.5 hover:bg-gray-300">
                <button onClick={handleEditBookmarkClick}>Edit Bookmark</button> 
              </div>
              <div className="pl-5 mb-1 py-1.5 hover:bg-gray-300">
                <button onClick={handleDeleteBookmarkClick}>Delete Bookmark</button> 
              </div>
          </div> 
          }
        </div>
      </div>
    }
  }
  export default Card;