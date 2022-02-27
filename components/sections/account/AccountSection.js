import dynamic from "next/dynamic";
import {
  FaBoxOpen,
  FaChevronRight,
  FaHome,
  FaLock,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import {
  ERROR,
  SUCCESS,
  useGlobalContext,
} from "../../../context/GlobalContext";
import {
  MY_ORDERS,
  ACCOUNT_DETAILS,
  CHANGE_PASSWORD,
  ADDRESS,
  useACcountContext,
} from "../../../pages/account";
import Axios from "../../../utils/Axios";
import { useRouter } from "next/router";

const MyOrdersSection = dynamic(() => import("./sections/MyOrdersSection")); 
const AccountDetailsSection = dynamic(() =>
  import("./sections/AccountDetailsSection")
);
const ChangePasswordSection = dynamic(() =>
  import("./sections/ChangePasswordSection")
);
const AddressSection = dynamic(() => import("./sections/AddressSection"));

const AccountSection = () => {
  const [state] = useACcountContext();
  const Router = useRouter();
  const [, setGlobalState] = useGlobalContext();

  const logout = async () => {
    try {
      await Axios.put("/users/logout");

      // update state
      setGlobalState((state) => ({
        ...state,
        auth: { ...state.auth, loading: false, user: null },
        cartData: { ...state.cartData, cart: [] },
        alert: {
          ...state.alert,
          show: true,
          text: "logged out",
          type: SUCCESS,
          timeout: 3000,
        },
      }));

      // go to login page
      Router.push("/login");
    } catch (error) {
      setGlobalState((state) => ({
        ...state,
        alert: {
          ...state.alert,
          show: true,
          type: ERROR,
          timeout: 5000,
          text:
            error.response?.data?.message || error.message || "Network Error",
        },
      }));
    }
  };

  return (
    <div className=" py-12 flex flex-col min-h-screen bg-[#f1f2f6]">
      <div className="px-5 lg:px-20">
        <h1 className="text-3xl capitalize">My account</h1>
        <MobileOptions logout={logout} />
      </div>
      <div className="flex-1 flex gap-8 mt-10 bg-white px-5 lg:px-20 py-10">
        <DesktopSideBar logout={logout} />
        {state.activeSection === MY_ORDERS ? (
          <MyOrdersSection />
        ) : state.activeSection === ACCOUNT_DETAILS ? (
          <AccountDetailsSection />
        ) : state.activeSection === CHANGE_PASSWORD ? (
          <ChangePasswordSection />
        ) : (
          state.activeSection === ADDRESS && <AddressSection />
        )}
      </div>
    </div>
  );
};

export default AccountSection;

const DesktopSideBar = ({ logout }) => {
  const [state, setState] = useACcountContext();
  const [globalState] = useGlobalContext();
  const Item = ({ text, children, section }) => {
    return (
      <button
        className={`flex items-center justify-between gap-2 ml-2 transition p-3 capitalize whitespace-nowrap group ${
          state.activeSection === section ? "bg-gray-200" : "hover:bg-gray-200"
        }`}
        onClick={() =>
          setState((state) => ({ ...state, activeSection: section }))
        }
      >
        <div className="flex items-center gap-2">
          {children}
          <span>{text}</span>
        </div>
        <FaChevronRight
          className={`text-gray-300 transition ${
            state.activeSection === section
              ? "text-gray-500"
              : " group-hover:text-gray-500"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="hidden md:flex flex-col text-gray-700 bg-white">
      <p className="text-xl font-semibold whitespace-nowrap mb-5">
        Welcome, {globalState.auth.user?.firstName}
      </p>
      <Item text="orders" section={MY_ORDERS}>
        <FaBoxOpen className="text-2xl" />
      </Item>
      <Item text="account details" section={ACCOUNT_DETAILS}>
        <FaUser className="text-2xl" />
      </Item>
      <Item text="change password" section={CHANGE_PASSWORD}>
        <FaLock className="text-2xl" />
      </Item>
      <Item text="addresses" section={ADDRESS}>
        <FaHome className="text-2xl" />
      </Item>
      <button
        className="flex items-center justify-between gap-16 ml-2 transition hover:bg-gray-200 p-3 capitalize whitespace-nowrap group"
        onClick={logout}
      >
        <div className="flex items-center gap-2">
          <FaSignOutAlt className="text-2xl" />
          <span>log out</span>
        </div>
        <FaChevronRight className="text-gray-300 transition group-hover:text-gray-500" />
      </button>
    </div>
  );
};

const MobileOptions = ({ logout }) => {
  const [state, setState] = useACcountContext();
  const Item = ({ text, section }) => {
    return (
      <button
        className={`transition capitalize whitespace-nowrap ${
          state.activeSection === section ? "font-semibold" : ""
        }`}
        onClick={() =>
          setState((state) => ({ ...state, activeSection: section }))
        }
      >
        <div className="flex items-center gap-2">
          <span>{text}</span>
        </div>
      </button>
    );
  };
  return (
    <div className="md:hidden mt-5 flex gap-5 flex-wrap items-center">
      <Item text="orders" section={MY_ORDERS}></Item>
      <Item text="persnal data" section={ACCOUNT_DETAILS}></Item>
      <Item text="change password" section={CHANGE_PASSWORD}></Item>
      <Item text="addresses" section={ADDRESS}></Item>
      <button
        className="flex items-center gap-2 py-1 px-3 border border-gray-500 transition hover:bg-gray-800 hover:text-white"
        onClick={logout}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
};
