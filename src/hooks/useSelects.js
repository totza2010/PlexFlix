import { useEffect, useState } from "react";

const useSelects = ({ selectLocation, defaultState = "" }) => {
  const [activeSelect, setActiveSelect] = useState(defaultState);

  useEffect(() => {
    const selectStates = JSON.parse(localStorage.getItem("selectStates")) || {};

    if (selectStates[selectLocation]) {
      setActiveSelect(selectStates[selectLocation]);
    } else {
      setActiveSelect(defaultState);
    }
  }, [selectLocation, defaultState]);

  const setSelect = (key) => {
    if (key === activeSelect) return;

    localStorage.setItem(
      "selectStates",
      JSON.stringify({ ...JSON.parse(localStorage.getItem("selectStates")), [selectLocation]: key })
    );

    setActiveSelect(key);
  };

  return { activeSelect, setSelect };
};

export default useSelects;
