import React, { useState } from 'react';
import Card from './Card'

function Viewport({content,files, setCurID, searchQuery, setSearchQuery, fetchAll}){

    const [focusedCard, setCardFocus] = useState(-1);
    const [cardOptionsOpen, setCardOptionsOpen] = useState(false);
    const [cardOptionsID, setCardOptionsID] = useState(-1);
    
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
            setCardFocus={setCardFocus} focusedCard={focusedCard}
            cardOptionsOpen={cardOptionsOpen} setCardOptionsOpen={setCardOptionsOpen} cardOptionsID={cardOptionsID} setCardOptionsID={setCardOptionsID}
            fetchAll={fetchAll} ind={ind} len={childArr2.length}/>)
        }
      })
    } else {
      childArr2.map( (ID, ind) => {
        Cards.push( <Card cardID={ID} files={files} setCurID={setCurID} 
          setCardFocus={setCardFocus} focusedCard={focusedCard}
          cardOptionsOpen={cardOptionsOpen} setCardOptionsOpen={setCardOptionsOpen} cardOptionsID={cardOptionsID} setCardOptionsID={setCardOptionsID}
          fetchAll={fetchAll} ind={ind} len={childArr2.length}/>)
      })
    }
    return Cards;
  }

  export default Viewport;