// @ts-nocheck
import { useState } from "react";

const useSelectedOption = (options = [], defaultValue = null) => {
  const [selected, setSelected] = useState(defaultValue);

  const selectOption = (option) => {
    setSelected(option);
  };

  const isSelected = (option) => selected === option;

  return { selected, selectOption, isSelected, options };
};

export default useSelectedOption;
