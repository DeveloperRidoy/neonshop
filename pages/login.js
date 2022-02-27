import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import CustomLink from "../components/CustomLink";
import LoadingBtn from "../components/LoadingBtn";
import {
  ERROR,
  SUCCESS,
  useGlobalContext,
} from "../context/GlobalContext";
import connectDb from "../server/utils/connectDb";
import getUpdatedCart from "../server/utils/getUpdatedCart";
import Axios from "../utils/Axios";
import getLoggedInUser from "../utils/getLoggedInUser";

const Login = () => {
  const Router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, setGlobalState] = useGlobalContext();
  const [state, setState] = useState({
    email: "",
    password: "",
    error: "",
  });

  const inputChange = (e) =>
    setState((state) => ({ ...state, [e.target.name]: e.target.value }));

  const login = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await Axios.post("/users/login", {
        email: state.email,
        password: state.password,
      });
  
      setGlobalState((state) => ({
        ...state,
        auth: { ...state.auth, user: res.data.user },
        alert: {
          ...state.alert,
          show: true,
          text: res.data.message,
          type: SUCCESS,
          timeout: 3000,
        },
      }));
      setLoading(false);
      Router.push("/account");
    } catch (error) {
      setLoading(false);

      const text =
        error.response?.status === 429
          ? error.response.data
          : error.response.data?.message || error.message || "Network Error";

      setGlobalState((state) => ({
        ...state,
        alert: { ...state.alert, show: true, text, type: ERROR, timeout: 5000 },
      }));
    }
  };

  return (
    <div className="px-5 lg:px-20 py-20">
      <Head>
        <title>Login | NeonSignCo</title>
      </Head>
      <h1 className="text-3xl lg:text-5xl text-center capitalize">login</h1>
      <div className="flex flex-col items-center">
        <form
          className="mt-10 p-4 rounded border border-gray-300 w-full sm:w-[500px] grid gap-5 transition"
          onSubmit={login}
        >
          <div className="grid gap-3">
            <label htmlFor="email" className="capitalize font-semibold">
              email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              autoComplete="current-email"
              value={state.email}
              onChange={inputChange}
              className="p-2 rounded-sm border border-gray-300"
              required
            />
          </div>
          <div className="grid gap-3">
            <label htmlFor="password" className="capitalize font-semibold">
              password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              autoComplete="current-password"
              value={state.password}
              onChange={inputChange}
              className="p-2 rounded-sm border border-gray-300"
              required
            />
          </div>
          {state.error && (
            <p className="text-red-500 text-center">{state.error}</p>
          )}
          <LoadingBtn
            loading={loading}
            className="p-1.5 px-3 bg-gray-800 text-white max-w-max px-3 capitalize"
          >
            login
          </LoadingBtn>
        </form>
        <p className="mt-5">
          Don't have an account ?{" "}
          <CustomLink href="/signup" text="Sign up" className="font-semibold" />{" "}
        </p>
        <CustomLink
          href="/forgot-password"
          text="Forgot Password?"
          className="font-semibold"
        />
      </div>
    </div>
  );
};

export default Login;

export const getServerSideProps = async ({ req }) => {
  try {
     await connectDb();

     const user = await getLoggedInUser(req);
    const cart = await getUpdatedCart({
      userId: user?._id,
      tempUserId: req.cookies.tempUserId,
    });
    
    if (user) {
      return {
        redirect: {
          destination: "/account",
          permanent: false,
        },
      };
    }

    return {
      props: {
        serverRendered: true, 
        cart: JSON.parse(JSON.stringify(cart))
      },
    };
  } catch (error) {
    console.log(error)
    return {
      props: {
        error: {code: 500, message: 'server error'}
      },
    };
  }
};
