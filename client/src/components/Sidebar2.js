import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import File from './File'

function SideBar2({files, curId, setCurID, dfsNode=1, collapsed, setCollapsed, depth=0, curIdDragging, setCurIdDragging, fetchAll}) {
    const [foldersBel, setFoldersBel] = useState([])

  useEffect( ()=> { //BUG: DOES NOT UPDATE AFTER FETCH ALL
    // console.log("UPDATED SIDEBAR 2");
      let tmp = files.find(x => x.id===dfsNode);
      let tmpFolders = [];
      if(tmp){
        let childArr = tmp.child_id.split(',').filter(x => x!=='');
        childArr.forEach( x => {
          let z = files.find(y => y.id === parseInt(x))
          if (z && z.type==="Folder"){
            tmpFolders.push(z)
          }
        })
        setFoldersBel(tmpFolders);
        // console.log("BEL", tmpFolders, childArr);
      }
  }, [files])
  
    // console.log(dfsNode, foldersBel.length);
    return (
      <div>
        {
          foldersBel.map( (x,ind) => {
            return <div className="">
              <div className={classNames("hover:bg-gray-200 rounded-r-full",
              {
                // TODO: should be taking from child if child hovered
              'bg-blue-200': x.id===curId,
              'hover: bg-blue-200': x.id===curId
              }
              )}>
                <File key={ind} val={x} curId={curId} setCurID={setCurID} collapsed={collapsed} setCollapsed={setCollapsed} myDepth={depth} numBel={foldersBel.length}
                curIdDragging={curIdDragging} setCurIdDragging={setCurIdDragging} fetchAll={fetchAll}/>:
              </div>
              { collapsed && collapsed.find(y=> y.id===x.id) && 
                !collapsed.find(y=> y.id===x.id).isCollapsed?
                <SideBar2 files={files} curId={curId} setCurID={setCurID} dfsNode={x.id} collapsed={collapsed} setCollapsed={setCollapsed} depth={depth+1}
                curIdDragging={curIdDragging} setCurIdDragging={setCurIdDragging} fetchAll={fetchAll}/>:
                <div>
                </div>
              }
            </div>
          })
        }
      </div>
  
    )
  }

  export default SideBar2