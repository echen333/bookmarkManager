import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import listenForOutsideClicks from '../utils/listenForOutsideClicks';

function LinkPopup({setLinkPopupOpen, curId, files, listening, setListening, fetchAll}) {
    
    const [formName, setFormName] = useState("");
    const [formURL, setFormURL] = useState("");
    const menuRef = useRef(null);
  
    const SaveButton = async () => {
      if(formURL.length===0 || formName.length===0){
        console.log("EMPTY", formName, formURL);
        // return;
      }
      setLinkPopupOpen(false);
      var bodyFormData = new FormData();
      let tmp = formURL;
      if(!formURL.includes("http")){
        tmp = "http://"+formURL;
        setFormURL(tmp);
      }
      bodyFormData.append('link', tmp);
      bodyFormData.append('title', formName);
      bodyFormData.append('par_id', curId);
      for (var key of bodyFormData.entries()) {
        console.log(key[0] + ', ' + key[1]);
      }
      const ret = await axios.post('/polls/addLink/', bodyFormData);
      fetchAll();
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
    useEffect( () => {
      const handleType = (event) => {
        if (event.key === 'Enter'){
          SaveButton();
          return;
        }
        if (event.key === 'Escape'){
          CancelButton();
          return;
        }
        return;
      }
      window.addEventListener('keyup', handleType)
  
      return () => {
        window.removeEventListener('keyup', handleType)
      }
  }, []);
  
    useEffect(listenForOutsideClicks(
      listening,
      setListening,
      menuRef,
      setLinkPopupOpen,
    ));
  
    return (
      <div>
        <div className="bg-cover bg-gray-600 z-40 opacity-75 absolute left-0 right-0 top-0 bottom-0">
        </div>
        <div ref={menuRef} className="bg-white absolute w-[30rem] h-72 left-2/4 top-2/4 rounded-lg z-50 -translate-x-1/2 -translate-y-1/2">
          <div className="ml-10 font-semibold mt-6 mb-3"> Add Bookmark
          </div>
          <div className="ml-10 mb-8">
            <div className="text-[10px] font-bold text-gray-700 mb-2">
              Name
            </div>
            <div>
              <input className="bg-gray-200 border-b-2 focus:outline-none rounded-sm m-0 pl-2 h-7 w-11/12
               focus:border-blue-500 transition duration-500" value={formName} onChange={nameChange}></input>
            </div>
          </div>
          <div className="ml-10">
          <div className="text-[10px] font-bold text-gray-700 mb-2">
              URL
            </div>
            <div>
              <input className="bg-gray-200 border-b-2 focus:outline-none rounded-sm pl-2 h-7 w-11/12
               focus:border-blue-500 transition duration-500" value={formURL} onChange={URLChange}></input>
            </div>
          </div>
          <div className="absolute bottom-0 right-0">
            <button onClick={CancelButton} className="bg-white border-gray-300 border-[1px] rounded-md w-16 h-8 mr-4 text-blue-600 font-bold text-sm hover:bg-blue-50">Cancel</button>
            <button onClick={SaveButton} className="bg-blue-700 rounded-md w-16 h-8 mr-4 mb-4 text-white font-semibold text-sm hover:bg-blue-500">Save</button>
          </div>
        </div>
      </div>
      
    )
  }

export default LinkPopup;