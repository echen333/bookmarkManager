import axios from 'axios'
import { AiOutlineSearch} from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'

function NavBar({optionsOpen, setOptionsOpen, setFolderPopupOpen, setLinkPopupOpen, searchQuery, setSearchQuery, curId, fetchAll}) {
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
  
    return (
      <div className="flex h-10 mt-1 mb-3 items-center">
        <img src={require('../img/chromeIcon.png')} alt="Chrome Icon" className="h-6 w-6 mx-4"></img>
        <div className=" text-2xl font-sans font-semibold">
          Bookmarks
        </div>
        <div className="border-gray-300 rounded-3xl flex flex-1 ml-8 z-10 h-full bg-gray-100 
              text-sm mx-3 items-center">
          <AiOutlineSearch className="h-6 w-6 hover:bg-gray-300 hover: cursor-pointer rounded-full ml-2"/>
          <input className="pl-3 focus:outline-none bg-gray-100 w-full"
            placeholder="Search bookmarks"
            type="search" onChange={searchChange} value={searchQuery}/>
        </div>
        <div className="h-8 w-8 mx-3 hover:bg-gray-300 rounded-full" onClick={optionsClicked} onBlur={optionsFocusedOut}>
          {!optionsOpen && <BsThreeDotsVertical className="hover:cursor-pointer h-4 w-4 top-4 right-5 absolute mx-auto" onBlur={optionsFocusedOut}/>
          }
        </div>
        {optionsOpen && 
          <div className="shadow-2xl border-gray-100 border-[1px] rounded-md bg-white absolute top-2 right-3 w-40 z-10 flex flex-col justify-start text-sm">
  
            <div className="ml-5 mt-3 my-1">
              <button onClick={sortChildren}> Sort by name</button> 
            </div>
            <div className="ml-5 my-1">
              <button onClick={newBookmark}> Add new bookmark</button> 
            </div>
            <div className="ml-5 mb-3 my-1">
              <button onClick={newFolder}> Add new folder</button> 
            </div>
          </div> 
        }
      </div>
    )
}

export default NavBar;