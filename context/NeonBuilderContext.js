import { createContext, useContext, useEffect, useState } from "react";
import { colors, fonts, sizes } from "../utils/CustomNeonAssets";

const Context = createContext();
export const useNeonBuilderContext = () => useContext(Context);
export const CLEARACRYLIC = "clear acrylic";
export const BLACKACRYLIC = "black acrylic";
export const MIRRORACRYLIC = 'mirror acrylic';
export const GOLDMIRRORACRYLIC = 'gold mirror acrylic';
export const SQUARE = 'square'; 
export const ROUND = 'round'; 
export const CUT_TO_SHAPE = 'cut to shape'; 
export const MEDIUM = 'medium'; 
export const LARGE = 'large';

const NeonBuilderContext = ({ children }) => {
  const [state, setState] = useState({
    data: {
      text: "",
      font: fonts[0],
      color: colors[1],
      width: '', 
      size: sizes[0],
      backing: {
        backingColor: CLEARACRYLIC, 
        backingType: SQUARE
      },
      price: 0,
      mountType: "WALL",  
      icon: '', 
      note: '', 
      concent: false
    },
    controls: { showNavigation: false, typing: false }, 
    error: {text: '', concent: ''}
  });

  useEffect(() => {
    const handler = () => {
      if (state.controls.typing) {
        setState(state => ({...state, controls: {...state.controls, typing: false}})); 
      }
    }
    
    const debounce = setTimeout(handler, 1500);
    return () => clearTimeout(debounce);

  }, [state.data.text])

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default NeonBuilderContext;
