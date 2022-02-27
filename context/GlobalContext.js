import { createContext, useContext, useEffect, useState } from "react";
import getInitialData from "../utils/getInitialData";
import { useRouter } from 'next/router';

const Context = createContext();
export const useGlobalContext = () => useContext(Context);

// variables
export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";
export const NOT_LOGGED_IN_EVALUATED = "NOT_LOGGED_IN_EVALUATED";
export const NOT_FOUND_EVALUATED = 'NOT_FOUND_EVALUATED';
const GlobalContext = ({ children, props }) => {
  const Router = useRouter();
  const serverRendered = props.serverRendered || false;
  const showBanner = Router.route !== "/custom-neon-sign";
  const [state, setState] = useState({
    serverRendered,
    showMobileMenu: false,
    showBanner,
    modal: { show: false, type: "", data: {} },
    auth: { loading: !serverRendered, user: props.user  },
    categoryData: { loading: true, categories: [] },
    cartData: { show: false, loading: !serverRendered, cart: props.cart },
    alert: { show: false, type: SUCCESS, text: "", timeout: 5000 },
    error: props.error,
  });


  useEffect(async () => {
    await getInitialData(state, setState);
    return () => {};
  }, []);  
  
  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default GlobalContext;
