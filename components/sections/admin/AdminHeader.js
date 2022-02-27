import { BsArrowClockwise, BsList } from "react-icons/bs"
import { useAdminContext } from "../../../pages/admin";
import CustomLink from "../../CustomLink"
import {  useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPowerOff } from 'react-icons/fa';
import { SUCCESS, useGlobalContext } from "../../../context/GlobalContext";
import catchASync from "../../../utils/catchASync";
import Axios from "../../../utils/Axios";
import { useRouter } from "next/router";

const AdminHeader = () => {
  const Router = useRouter();
  const [globalState, setGlobalState] = useGlobalContext(); 
  const [state, setState] = useAdminContext();
  const [expand, setExpand] = useState();
  const [loading, setLoading] = useState(false);

  const logOut = () => catchASync(async () => {
    await Axios.put('users/logout'); 
    setGlobalState((state) => ({
      ...state,
      auth: { loading: false, user: null },
      cartData: { ...state.cartData, cart: [] }, 
      alert: {...state.alert, show: true, text: 'logged out', type: SUCCESS, timeout: 2000}
    }));
    Router.push('/login');
  }, setGlobalState)


  const refreshData = () => catchASync(async () => {

    setLoading(true); 
    const products = (await Axios.get('products?limit=30')).data.products;

    const categories = (await Axios.get('categories')).data.categories; 
    const orders = (
      await Axios.get(
        `orders?from=${new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)}` //last three months orders
      )
    ).data.orders; 

    setLoading(false); 

    setState(state => ({ ...state, products, categories, orders }));

    setGlobalState(state => ({...state, alert: {...state.alert, show: true, text: 'updated', type: SUCCESS, timeout: 1000}}))
   }, setGlobalState, () => setLoading(false));
   
    return (
      <div className="pl-2 pr-4 py-2 flex justify-between items-center bg-gray-800 text-white ">
        <button
          className={`transition h-10 w-10 rounded-full flex items-center justify-center bg-gray-700 active:bg-gray-600 ${
            state.sidebar.expand ? "rotate-180" : ""
          }`}
          onClick={() =>
            setState((state) => ({
              ...state,
              sidebar: { ...state.sidebar, expand: !state.sidebar.expand },
            }))
          }
        >
          <BsList className="text-2xl text-gray-300 " />
        </button>
        <CustomLink text="NeonSignCo" className="text-3xl hidden  sm:block" />
        <div className="flex items-center gap-3">
          <button
            className="transition active:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center"
            onClick={refreshData}
          >
            <BsArrowClockwise
              className={`text-2xl ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <div className="relative">
            <button
              className="flex items-center gap-1 rounded-full transition  active:bg-gray-700 py-1 px-2 rounded"
              onClick={() => setExpand((bool) => !bool)}
            >
              <img
                src="/img/client-images/client-5.jpg"
                alt="admin"
                className="w-8 h-8 rounded-full object-cover"
              />
              <p className="capitalize">{globalState.auth?.user?.userName}</p>
            </button>
            <AnimatePresence>
              {expand && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { duration: 0.1 } }}
                  exit={{ scale: 0 }}
                  className=""
                >
                  <div className="absolute right-0 bg-gray-700 shadow p-2 rounded">
                    <button
                      className="flex gap-2 items-center px-5 py-3 hover:bg-gray-600 whitespace-nowrap"
                      onClick={logOut}
                    >
                      <FaPowerOff />
                      <span>log out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
}

export default AdminHeader
