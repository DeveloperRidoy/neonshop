import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft, FaBoxOpen, FaDollarSign, FaEdit, FaFolderOpen } from "react-icons/fa"
import { ADD_NEW_PRODUCT, CATEGORIES, CUSTOMERS, DASHBOARD, ORDERS, PRODUCTS, REVIEWS, useAdminContext } from "../../../pages/admin";

const Sidebar = () => { 
    return (
      <div className=" bg-gray-800 text-white">
        <Desktop /> 
        <Mobile/>
      </div>
    );
}

export default Sidebar

const Desktop = () => {
    const [state, setState] = useAdminContext(); 


    const Item = ({ text, children, section, className }) => {
        return (
          <button
            className={`flex gap-4 items-center p-2 transition active:bg-gray-600 px-4 relative ${
              state.activeSection === section
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            } ${className}`}
            onClick={() =>
              setState((state) => ({ ...state, activeSection: section }))
            }
            title={text}
          >
            <div className="text-gray-500">{children}</div>
            <p className="capitalize whitespace-nowrap">{text}</p>
            {section === state.activeSection && (
              <div className="absolute h-full w-1 left-0 bg-purple-500"></div>
            )}
          </button>
        );
  };

  
    return (
      <div className="hidden md:block h-full">
        <motion.div
          animate={{
            width: state.sidebar.expand ? "auto" : 52,
            transition: { duration: 0.2 },
          }}
          className="h-full flex flex-col text-lg overflow-hidden "
        >
          <Item text="dashboard" section={DASHBOARD}>
            <div className="h-5 w-5 grid grid-cols-2 gap-[2px]">
              <div className="bg-gray-500 row-span-6"></div>
              <div className="bg-gray-500 row-span-4"></div>
              <div className="bg-gray-500 row-span-6"></div>
              <div className="bg-gray-500 row-span-4"></div>
            </div>
          </Item>
          <Item text="orders" section={ORDERS}>
            <FaDollarSign className="w-5" />
          </Item>
          <Item text="products" section={PRODUCTS}>
            <FaBoxOpen className="w-5" />
          </Item>
          <Item text="add new product" section={ADD_NEW_PRODUCT}>
            <FaEdit className="w-5" />
          </Item>
          <Item text="categories" section={CATEGORIES}>
            <FaFolderOpen className="w-5" />
          </Item>
        </motion.div>
      </div>
    );
}


const Mobile = () => {
  const [state, setState] = useAdminContext();

  const Item = ({ text, children, section }) => {
    return (
      <button
        className={`flex gap-4 items-center p-2 transition active:bg-gray-600 px-4 relative ${
              state.activeSection === section
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
        onClick={() =>
          setState((state) => ({
            ...state,
            activeSection: section,
            sidebar: { ...state.sidebar, expand: false },
          }))
        }
        title={text}
      >
        <div className="text-gray-500">{children}</div>
        <p className="capitalize">{text}</p>
        {section === state.activeSection && (
          <div className="absolute h-full w-1 left-0 bg-purple-500"></div>
        )}
      </button>
    );
  };
  return (
    <div className="md:hidden">
      <motion.div
        animate={{
          x: state.sidebar.expand ? 0 : "-100%",
          transition: { duration: 0.3 },
        }}
        className="h-full fixed top-0 flex flex-col text-lg bg-gray-800 overflow-hidden z-10"
      >
        <button
          className="ml-auto mt-2 mr-2 mb-2 h-10 w-10 transition bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
          onClick={() =>
            setState((state) => ({
              ...state,
              sidebar: { ...state.sidebar, expand: false },
            }))
          }
        >
          <FaArrowLeft />
        </button>
        <Item text="dashboard" section={DASHBOARD}>
          <div className="h-5 w-5 grid grid-cols-2 gap-[2px]">
            <div className="bg-gray-500 row-span-6"></div>
            <div className="bg-gray-500 row-span-4"></div>
            <div className="bg-gray-500 row-span-6"></div>
            <div className="bg-gray-500 row-span-4"></div>
          </div>
        </Item>
        <Item text="orders" section={ORDERS}>
          <FaDollarSign className="w-5" />
        </Item>
        <Item text="products" section={PRODUCTS}>
          <FaBoxOpen className="w-5" />
        </Item>
        <Item text="add new product" section={ADD_NEW_PRODUCT}>
          <FaEdit className="w-5" />
        </Item>
        <Item text="categories" section={CATEGORIES}>
          <FaFolderOpen className="w-5" />
        </Item>
      </motion.div>
      <AnimatePresence>
        {state.sidebar.expand && (
          <motion.div
            className="fixed inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setState((state) => ({
                ...state,
                sidebar: { ...state.sidebar, expand: false },
              }))
            }
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
