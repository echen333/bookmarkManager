import React, { useState } from 'react';
import { AiOutlineFolder,  } from 'react-icons/ai'
import { MdOutlineKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import classNames from 'classnames';
import axios from 'axios'

function File({val, curId, setCurID, collapsed, setCollapsed, myDepth, numBel, fetchAll, curIdDragging}) {

    const [draggedOver, setDraggedOver] = useState(false);
    const dragOver = (e) => {
      e.preventDefault();
      setDraggedOver(true);
    }
    const dragLeave = () => {
      setDraggedOver(false);
    }
    const handleDrop = async (e) => {
      setDraggedOver(false);
      e.preventDefault();
      console.log(curIdDragging, "DROPPED", val.id);//need the cardID for which dropped
      await axios.get(`/polls/${curIdDragging}/${val.id}/changePar`)
      fetchAll();
    }

    const handleClick = () => {
      setCurID(val.id);
    }
    const handleCollapseClick = () => {
      let ind = collapsed.findIndex(x => x.id === val.id);
      if(ind){
        let tmp = [...collapsed];
        let OBJ=collapsed[ind];
        tmp[ind] = {"id":val.id, "isCollapsed":!OBJ.isCollapsed}
        setCollapsed(tmp);
      }
    }
    let TMP=false;
    if(collapsed){
      let TMP2=collapsed.find(x => x.id===val.id)
      if(TMP2){
        TMP = TMP2.isCollapsed;
      }
    }
    // console.log(numBel>0, val.id, numBel);
    
    return <div > 
      <div className={classNames('hover:cursor-pointer rounded-r-full h-10 flex flex-col', 
        {
          'bg-blue-200':val.id===curId || draggedOver,
          'hover: bg-blue-200':val.id===curId,
          [`pl-${3*myDepth}`]: true
        }
      )} onClick={handleClick} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={handleDrop}>
        <div className="flex">
          {val.type === "Folder" && 
              <div className="flex mt-2 mr-2">
                {
                  numBel>0 && 
                    <div className="rounded-full hover:bg-gray-500 py-0.5" onClick={handleCollapseClick}>
                      { !TMP ? <MdKeyboardArrowDown className="h-6 w-6 mr-1"/>:
                      <MdOutlineKeyboardArrowRight className="h-6 w-6 mr-1"/>
                      }
                    </div>
                }
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

  export default File;