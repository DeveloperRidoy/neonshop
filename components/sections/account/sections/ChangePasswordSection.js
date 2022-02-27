import { useState } from "react";
import { SUCCESS, useGlobalContext } from "../../../../context/GlobalContext";
import Axios from "../../../../utils/Axios";
import catchASync from "../../../../utils/catchASync";
import CustomLink from "../../../CustomLink";
import LoadingBtn from "../../../LoadingBtn";

const ChangePasswordSection = () => {
  const [, setGlobalState] = useGlobalContext();

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    currentPassword: '', 
    newPassword: "", 
    confirmPassword: "",  
    error: ""
    })
      
  const inputChange = (e) =>
    setState((state) => ({
      ...state,
      [e.target.name]: e.target.value,
      error: state.error
        ? state.newPassword === state.confirmPassword
          ? ""
          : "passwords do not match"
        : "",
    }));
  
  const updatePassword = (e) => catchASync(async () => {
    e.preventDefault(); 
    if (state.newPassword !== state.confirmPassword) return setState((state) => ({ ...state, error: "passwords do not match" }));

    setLoading(true);
    const res = await Axios.patch('users/change-password', state);
    setLoading(false); 
    setState(state => ({ ...state, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setGlobalState(state => ({ ...state, alert: { ...state.alert, show: true, text: res.data.message, type: SUCCESS, timeout: 3000 } }));
  }, setGlobalState, () => setLoading(false));

    return (
      <div className="bg-white w-full">
        <h2 className="text-xl font-semibold capitalize">change password</h2>
        <form className="mt-5 grid gap-5" onSubmit={updatePassword}>
          <div className="grid gap-2 max-w-max">
            <label
              htmlFor="currentPassword"
              className="capitalize font-semibold"
            >
              current password *
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              autoComplete="current-password"
              value={state.currentPassword}
              onChange={inputChange}
              placeholder="Current Password"
              className="p-2 bg-gray-200"
              required
            />
          </div>
          <div className="grid gap-2 max-w-max">
            <label htmlFor="newPassword" className="capitalize font-semibold">
              new password *
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              autoComplete="new-password"
              value={state.newPassword}
              onChange={inputChange}
              minLength={6}
              maxLength={16}
              placeholder="new Password"
              className="p-2 bg-gray-200"
              required
            />
          </div>
          <div className="grid gap-2 max-w-max">
            <label
              htmlFor="confirmPassword"
              className="capitalize font-semibold"
            >
              confirm password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="new-password"
              value={state.confirmPassword}
              onChange={inputChange}
              minLength={6}
              maxLength={16}
              placeholder="Confirm Password"
              className="p-2 bg-gray-200"
              required
            />
          </div>
          {state.error && <p className="text-red-500">{state.error}</p>}
          <LoadingBtn
            loading={loading}
            className="py-2 px-4 bg-gray-800 text-white font-semibold max-w-max capitalize"
          >
            save changes
          </LoadingBtn>
        </form>
        <p className="mt-5">
          Forgot password ?{" "}
          <CustomLink
            className="capitalize font-semibold"
            href="/forgot-password"
            text="reset password"
          />{" "}
        </p>
      </div>
    );
}

export default ChangePasswordSection
