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

const SignUp = () => {
  const Router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, setGlobalState] = useGlobalContext();
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
  });

  const inputChange = (e) =>
    setState((state) => ({ ...state, [e.target.name]: e.target.value }));

  const signUp = async (e) => {
    try {
      e.preventDefault();

      // see if passwords match
      if (state.password !== state.confirmPassword)
        return setState((state) => ({
          ...state,
          error: "Passwords do not match.",
        }));

      setLoading(true);
      const res = await Axios.post("/users/register", state);
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
        <title>Sign Up | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl lg:text-5xl text-center capitalize">sign up</h1>
      <div className="flex flex-col items-center">
        <form
          className="mt-10 p-4 rounded border border-gray-300 w-full md:w-[600px] mx-auto grid gap-5 transition"
          onSubmit={signUp}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-2">
              <label htmlFor="firstName" className="capitalize font-semibold">
                first name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                value={state.firstName}
                onChange={inputChange}
                className="p-1.5 rounded-sm border border-gray-300"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="lastName" className="capitalize font-semibold">
                last name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={state.lastName}
                onChange={inputChange}
                className="p-1.5 rounded-sm border border-gray-300"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="userName" className="capitalize font-semibold">
              user name
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="User Name"
              value={state.userName}
              onChange={inputChange}
              className="p-1.5 rounded-sm border border-gray-300"
              required
            />
            <p className="text-gray-500 italic text-sm">
              this is how your name will appear in your account and reviews
            </p>
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="capitalize font-semibold">
              email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={state.email}
              onChange={inputChange}
              className="p-1.5 rounded-sm border border-gray-300"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="capitalize font-semibold">
              password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              min={6}
              max={16}
              autoComplete="new-password"
              value={state.password}
              onChange={(e) =>
                setState((state) => ({
                  ...state,
                  password: e.target.value,
                  error:
                    e.target.value === state.confirmPassword
                      ? ""
                      : "Passwords do not match",
                }))
              }
              className="p-1.5 rounded-sm border border-gray-300"
              required
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="confirmPassword"
              className="capitalize font-semibold"
            >
              confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
              min={6}
              max={16}
              autoComplete="new-password"
              value={state.confirmPassword}
              onChange={(e) =>
                setState((state) => ({
                  ...state,
                  confirmPassword: e.target.value,
                  error:
                    e.target.value === state.password
                      ? ""
                      : "Passwords do not match",
                }))
              }
              className="p-1.5 rounded-sm border border-gray-300"
              required
            />
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="termsAndConditions"
              id="termsAndConditions"
              placeholder="termsAndConditions"
              value={state.password}
              onChange={inputChange}
              className="p-1.5 rounded-sm border border-gray-300"
              required
            />
            <label htmlFor="termsAndConditions">
              I agree to the{" "}
              <CustomLink
                href="/terms-conditions"
                text="terms & conditions"
                className="font-semibold"
              />
            </label>
          </div>
          {state.error && (
            <p className="text-red-500 text-center">{state.error}</p>
          )}
          <LoadingBtn
            loading={loading}
            className="p-1.5 px-3 bg-gray-800 text-white max-w-max capitalize"
          >
            sign up
          </LoadingBtn>
        </form>
        <p className="mt-5">
          Already have an account ?{" "}
          <CustomLink href="/login" text="login" className="font-semibold" />{" "}
        </p>
      </div>
    </div>
  );
};

export default SignUp;

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
        }
      };
    }

    return {
      props: {
        serverRendered: true, 
        cart: JSON.parse(JSON.stringify(cart))
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
