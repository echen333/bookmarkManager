import React from 'react';
import classNames from 'classnames';
import File from './File'

function SideBar2({files, curId, setCurID, dfsNode=1, collapsed, setCollapsed}) {
    let tmp = files.find(x => x.id===dfsNode);
    let foldersBel=[]
    if(tmp){
      let childArr = tmp.child_id.split(',').filter(x => x!=='');
      childArr.forEach( x => {
        let z = files.find(y => y.id === parseInt(x))
        if (z && z.type==="Folder"){
          foldersBel.push(z)
        }
      })
    }
  
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

  export default SideBar2