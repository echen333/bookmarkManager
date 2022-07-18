import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineFolder,  } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import classNames from 'classnames';
import axios from 'axios'
import listenForOutsideClicks from '../utils/listenForOutsideClicks';

function Viewport({content,files,curId, setCurID, searchQuery, setSearchQuery, fetchAll, curIdDragging, setCurIdDragging, msg, setAlertMsg}){

    const [focusedCards, setFocusedCards] = useState([]);
    const [cardOptionsOpen, setCardOptionsOpen] = useState(false);
    const [cardOptionsID, setCardOptionsID] = useState(-1);
    const [curIndexDragging, setCurIndexDragging] = useState(-1);
    const [ctrlDown, setCtrlDown] = useState(false);
    const [clipboardIDs, setClipboardIDs] = useState([]);

    useEffect( () => {
      const handleType = async (event) => {
        if (event.keyCode ===67 && event.ctrlKey) {
          console.log("FOCUSED: ", focusedCards);
          setClipboardIDs(focusedCards);
          // if(focusedCards.length >=2){
          //   setAlertMsg(`${focusedCards.length} items copied`);
          // } else if (focusedCards.length === 1){
          //   //UNTESTEDx
          //   setAlertMsg(`${focusedCards.length} itemsd copied`);
          //   // setAlertMsg(files.find(x => x.id === focusedCards[0]).title +" copied")
          // } else {
          //   setAlertMsg("NONE")
          // }
          // setTimeout(setAlertMsg(""), 5000)
          console.log("COPIED!", focusedCards, focusedCards.length, focusedCards.length>0);
        }
        if (event.keyCode ===86 && event.ctrlKey) {
          console.log("PASTE!", focusedCards, focusedCards.length, focusedCards.length>0);
          var bodyFormData = new FormData();
          bodyFormData.append('clipboard', clipboardIDs);
          bodyFormData.append('par_id', curId);
          console.log("PASTE", curId, clipboardIDs);
          // const ret = await axios.post('/polls/addFolder/', bodyFormData);
          await axios.post('/polls/pasteItems/', bodyFormData)
        }
        if (event.key === 'Control'){
          setCtrlDown(true);
          return;
        }
        return;
      }
      const handleUp = (event) => {
        if (event.key === 'Control'){
          setCtrlDown(false);
          return;
        }
        return;
      }
      window.addEventListener('keydown', handleType)
      window.addEventListener('keyup', handleUp)
  
      return () => {
        window.removeEventListener('keydown', handleType)
        window.removeEventListener('keyup', handleUp)
      }
  }, []);

    if(content === undefined){
      return <div></div>
    }
    let childArr = content.child_id.split(","); 
    //filter to see if is active ID
    let childArr2 = childArr.filter(x => files.find(y => y.id === parseInt(x)));
  
    var Cards = [];
    if(searchQuery.length>0){
      files.forEach((x, ind) => {
        if(x.title.includes(searchQuery) || x.link.includes(searchQuery)){
          Cards.push( <Card cardID={x.id} files={files} setCurID={setCurID} 
            setFocusedCards={setFocusedCards} focusedCards={focusedCards}
            cardOptionsOpen={cardOptionsOpen} setCardOptionsOpen={setCardOptionsOpen} cardOptionsID={cardOptionsID} setCardOptionsID={setCardOptionsID}
            fetchAll={fetchAll} ind={ind} len={childArr2.length}
            curIdDragging={curIdDragging} setCurIdDragging={setCurIdDragging} curIndexDragging={curIndexDragging} setCurIndexDragging={setCurIndexDragging}
            />)
        }
      })
    } else {
      if(childArr2.length === 0) {
        // -translate-x-1/2 transform
        Cards.push( <div className="text-gray-600 font-semibold left-1/2 relative">Bookmarks folder is empty</div>)
      } else {
        childArr2.map( (ID, ind) => {
          Cards.push( <Card cardID={ID} files={files} setCurID={setCurID} 
            setFocusedCards={setFocusedCards} focusedCards={focusedCards}
            cardOptionsOpen={cardOptionsOpen} setCardOptionsOpen={setCardOptionsOpen} cardOptionsID={cardOptionsID} setCardOptionsID={setCardOptionsID}
            fetchAll={fetchAll} ind={ind} len={childArr2.length}
            curIdDragging={curIdDragging} setCurIdDragging={setCurIdDragging} curIndexDragging={curIndexDragging} setCurIndexDragging={setCurIndexDragging}
            ctrlDown={ctrlDown} setCtrlDown={setCtrlDown}
            />)
        })
      }
      
    }
    return Cards;
}

function Card({cardID, files, setCurID, setFocusedCards, focusedCards, cardOptionsID, setCardOptionsID, cardOptionsOpen, setCardOptionsOpen, fetchAll, ind, len, curIdDragging, setCurIdDragging,
              curIndexDragging, setCurIndexDragging, ctrlDown, setCtrlDown}){

    const menuRef = useRef(null);
    const [cardListening, setCardListening] = useState(false);
    const [draggedOver, setDraggedOver] = useState(false);
    const [draggedFolderOver, setDraggedFolderOver] = useState(false);
  
    const handleClick = (e) => {
      if(cardOptionsOpen){
        return;
      }
      if (ctrlDown) {
        if (focusedCards.includes(parseInt(cardID))){
          console.log("HI 2", focusedCards);
          setFocusedCards(focusedCards.filter(x => x!== parseInt(cardID)));
        } else {
          console.log("HI 1",  focusedCards);
          setFocusedCards([...focusedCards, parseInt(cardID)]);
        }
      } else {
        console.log("HI 3");
        setFocusedCards([parseInt(cardID)]);
      }
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
        setCardOptionsID(parseInt(cardID));
        console.log("HEY", parseInt(cardID));
      } else {
        console.log("ALREADY OPEN");
      }
    }
    const handleOpenNewTabClick = () => {
      console.log("OPEN NEW TAB");
      window.open(files.find(x => x.id===parseInt(cardID)).link);
    }
    const handleDeleteBookmarkClick = async () => {
      console.log("DELETING", cardID);
      await axios.get(`/polls/${cardID}/deletes/`)
      fetchAll();
      setCardOptionsOpen(false);
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
    const dragStarts = (e) => {
      console.log("Start DRAG");
    }
    const dragEnd = (e) => {
      console.log("ENDED DRAG");
    }
    const isDragging = (e) => {
      setCurIdDragging(cardID)
      setCurIndexDragging(ind)
      console.log("I AM BEING DRAGGED", cardID);
    }
    const dragOver = (e) => {
      e.preventDefault();
      if(files.find(x => x.id === parseInt(cardID)).type === "Folder"){
        setDraggedFolderOver(true);
      }
      setDraggedOver(true);
    }
    const dragLeave = () => {
      setDraggedFolderOver(false);
      setDraggedOver(false);
    }
    const handleDrop = async (e) => {
      setDraggedFolderOver(false);
      setDraggedOver(false);
      e.preventDefault();
      if(files.find(x => x.id === parseInt(cardID)).type === "Folder"){
        console.log(curIdDragging, "DROPPED", cardID);//need the cardID for which dropped
        await axios.get(`/polls/${curIdDragging}/${cardID}/changePar`)
        fetchAll();
        // console.log(e.target);
      } else {
        if(curIdDragging === cardID){
          return;
        }
        console.log(curIdDragging, "DROPPED", cardID);//need the cardID for which dropped
        if (ind<curIndexDragging){
          await axios.get(`/polls/${curIdDragging}/${cardID}/1/changeOrder`)
        } else {
          await axios.get(`/polls/${curIdDragging}/${cardID}/0/changeOrder`)
        }
        fetchAll();
      }
    }

    useEffect(listenForOutsideClicks(
      cardListening,
      setCardListening,
      menuRef,
      setCardOptionsOpen,
    ));
    useEffect( () => {
      if(cardOptionsOpen && cardOptionsID===parseInt(cardID)){
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
      return <div onClick={handleClick} onDragStart={dragStarts} onDrag={isDragging} onDragLeave={dragLeave} draggable={true} onDragOver={dragOver} onDrop={handleDrop}
        className={classNames("cursor-pointer py-2 pl-6 flex border-y-2",
        {
          'bg-blue-200': focusedCards.includes(parseInt(cardID)) || draggedFolderOver,
          'border-blue-400': draggedOver,
          'border-white': !draggedOver,
          'border-t-2 border-b-white': draggedOver && ind<curIndexDragging,
          'border-b-2 border-t-white': draggedOver && ind>curIndexDragging,
          'border-y-white': draggedOver && (ind===curIndexDragging || draggedFolderOver) ,
          'mt-2': ind===0,
          'mb-2': ind===len-1,
        })}>
        { tmp.type==="Folder"?
          <AiOutlineFolder className="h-6 w-6 mr-4"/>:
            imgFound?
            <img src={imgStr} className="w-6 h-6 mr-4" />
            :<img src="http://google.com/favicon.ico" className="w-6 h-6 mr-4" />
        }
        {tmp.title}
        {focusedCards.includes(parseInt(cardID)) && <div className="ml-4 text-gray-500">
          {tmp.link}
          </div>}
        <div className="absolute right-4 mt-1">
          <div onClick={handleOptionsClick} className="hover:bg-gray-200 absolute right-4 mt-1 rounded-full">
            <BsThreeDotsVertical />
          </div>
          { cardOptionsOpen && parseInt(cardID)===cardOptionsID && 
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

export default Viewport;