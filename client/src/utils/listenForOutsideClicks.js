function listenForOutsideClicks(listening, setListening, menuRef, setIsOpen) {
    return () => {
        console.log(listening, menuRef.current);
      if (listening) return;
      if (!menuRef.current) return;
      setListening(true);
      [`click`, `touchstart`].forEach((type) => {
        document.addEventListener(`click`, (evt) => {
            if (!menuRef.current) return;
            if (menuRef.current.contains(evt.target)) return;
            setIsOpen(false);
        });
      });
    }
  }

export default listenForOutsideClicks;

