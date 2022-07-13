import React from 'react';
import { AiOutlineFolder,  } from 'react-icons/ai'
import { MdOutlineKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import classNames from 'classnames';

function File({val, curId, setCurID, collapsed, setCollapsed, myDepth}) {
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
    
    return <div > 
      <div className={classNames('hover:cursor-pointer rounded-r-full h-10 flex flex-col', 
        {
          'bg-blue-200':val.id===curId,
          'hover: bg-blue-200':val.id===curId,
          [`pl-${myDepth}`]: true
        }
      )} onClick={handleClick}>
        <div className="flex">
          {val.type === "Folder" && 
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

  export default File;