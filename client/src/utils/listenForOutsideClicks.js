function listenForOutsideClicks(listening, setListening, menuRef, setIsOpen) {
    return () => {
      if (listening) return;
      if (!menuRef.current) return;
      setListening(true);
      [`click`, `touchstart`].forEach((type) => {
        document.addEventListener(`click`, (evt) => {
            console.log("ONE CLICK");
            if (!menuRef.current) return;
            if (menuRef.current.contains(evt.target)) return;
            console.log("OUTSIDE CLICK FIRED SET NOT OPEN");
            setIsOpen(false);
        });
      });
    }
  }

export default listenForOutsideClicks;

