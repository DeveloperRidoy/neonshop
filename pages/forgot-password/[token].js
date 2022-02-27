import { useState } from "react";
import LoadingBtn from "../../components/LoadingBtn";
import { ERROR, SUCCESS, useGlobalContext } from "../../context/GlobalContext";
import Axios from "../../utils/Axios";
import getToken from '../../utils/getToken';
import { useRouter } from 'next/router'
import Head from 'next/head';

const ResetPassword = ({ token, errorMessage }) => {
    const Router = useRouter();
  const [, setGlobalState] = useGlobalContext();
  const [state, setState] = useState({
    loading: false,
    password: '', 
      confirmPassword: '', 
    error: ''
  });

  const resetPassword = async (e) => {
    try {
      e.preventDefault();

        if (state.password !== state.confirmPassword) return setState(state => ({ ...state, error: 'passwords do not match' }));
        
      setState((state) => ({ ...state, loading: true }));

      const res = await Axios.post("users/reset-password", {
          password: state.password, confirmPassword: state.confirmPassword, token: token.token
      });

        setState((state) => ({ ...state, loading: false, email: "" }));
        // sign out user
      setGlobalState((state) => ({
          ...state, 
          auth: {...state.auth, loading: false, user: null},
        alert: {
          ...state.alert,
          show: true,
          text: res.data.message,
          type: SUCCESS,
          timeout: 5000,
        },
      }));
        
        // redirect to account page
        Router.replace('/account')
    } catch (error) {
      console.log(error);
      const text =
        error.response?.status === 429
          ? error.response.data
          : error.response.data?.message || error.message || "Network Error";
      setState((state) => ({ ...state, loading: false }));
      setGlobalState((state) => ({
        ...state,
        alert: { ...state.alert, show: true, text, type: ERROR, timeout: 5000 },
      }));
    }
    };
    

  return (
    <div className="p-5 lg:px-20 py-20">
      <Head>
        <title>Reset Password | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {errorMessage ? (
        <p className="text-lg md:text-2xl text-red-500 text-center py-20">
          {errorMessage}
        </p>
      ) : (
        <div>
          <h2 className="text-3xl lg:text-5xl capitalize  text-center">
            reset password
          </h2>
          <form
            className="mt-5 grid gap-5 p-2 border border-gray-300 sm:w-[500px] mx-auto"
            onSubmit={resetPassword}
          >
            <div className="grid gap-2 ">
              <label htmlFor="email" className="font-semibold">
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                minLength={6}
                maxLength={16}
                autoComplete="current-password"
                value={state.password}
                onChange={(e) =>
                  setState((state) => ({
                    ...state,
                    password: e.target.value,
                    error:
                      e.target.value === state.confirmPassword
                        ? state.error
                          ? ""
                          : ""
                        : state.error,
                  }))
                }
                className="p-2 bg-gray-200"
                required
              />
            </div>
            <div className="grid gap-2 ">
              <label htmlFor="email" className="font-semibold">
                Confirm Password
              </label>
              <input
                type="confirmPassword"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                minLength={6}
                maxLength={16}
                autoComplete="current-email"
                value={state.confirmPassword}
                onChange={(e) =>
                  setState((state) => ({
                    ...state,
                    confirmPassword: e.target.value,
                    error:
                      e.target.value === state.password
                        ? state.error
                          ? ""
                          : ""
                        : state.error,
                  }))
                }
                className="p-2 bg-gray-200"
                required
              />
            </div>
            <p className="text-red-500">{state.error}</p>
            <LoadingBtn
              loading={state.loading}
              className="py-2 px-4 bg-gray-800 text-white font-semibold max-w-max capitalize"
            >
              reset password
            </LoadingBtn>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;


export const getServerSideProps = async ({params}) => {
    let token = null;

    try {
        const existingToken = await getToken(params.token);  
      token = existingToken;
     
      if (!token) return { notFound: true };

      if (!token.expires || typeof token.expires !== "number") {
        await token.delete(); 
        return {
          notfound: true
        }
      }
      if (Date.now() > token.expires) {
         await token.delete(); 
          return {
            props: {
              errorMessage:
                "Token expired. Please request another one and try again.",
            },
          };
        }
          

        return {
            props: { token: JSON.parse(JSON.stringify(token))}
        }
    } catch (error) {
        return { notFound: true };
    }
}