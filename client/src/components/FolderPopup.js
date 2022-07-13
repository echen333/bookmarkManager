
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import listenForOutsideClick from "../utils/listenForOutsideClicks";

function FolderPopup({setFolderPopupOpen, curId, setFiles, files, Flistening, setFListening, fetchAll}) {
    
    const [formName, setFormName] = useState("");
    const menuRef = useRef(null);

    const SaveButton = async () => {
      setFolderPopupOpen(false);
      var bodyFormData = new FormData();
      bodyFormData.append('title', formName);
      bodyFormData.append('par_id', curId);
      const ret = await axios.post('/polls/addFolder/', bodyFormData);
      // TODO: setFiles( files => [...files, obj])
      fetchAll();
    }
    const CancelButton = () => {
      setFolderPopupOpen(false);
    }
    const nameChange = (e) => {
      setFormName(e.target.value);
    }

    useEffect(listenForOutsideClick(
        Flistening,
        setFListening,
        menuRef,
        setFolderPopupOpen,
    ));

    return (
        <div>
            <div className="bg-cover bg-gray-800 z-40 opacity-70 absolute left-0 right-0 top-0 bottom-0">
            </div>
        
            <div ref={menuRef} className="bg-white absolute w-[30rem] h-48 left-2/4 top-2/4 rounded-lg z-50 -translate-x-1/2 -translate-y-1/2 opacity-100">
                <div className="ml-10 font-semibold mt-6 mb-3"> Add Folder
                </div>
                <div className="ml-10 mb-8 focus-within:text-blue-500">
                    <div className="text-[10px] font-bold text-gray-700">
                    Name
                    </div>
                    <div>
                    <input className="bg-gray-200 border-0 focus:outline-none rounded-sm pl-2 h-7 w-11/12 focus:mb-2 border-b-2 focus:border-blue-500 transition" value={formName} onChange={nameChange}></input>
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

export default FolderPopup;