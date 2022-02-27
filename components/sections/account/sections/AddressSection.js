import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { SUCCESS, useGlobalContext } from "../../../../context/GlobalContext";
import Axios from "../../../../utils/Axios";
import catchASync from "../../../../utils/catchASync";
import countries from "../../../../utils/countries";
import LoadingBtn from "../../../LoadingBtn";

// variables 
const SHIPPING = 'SHIPPING'; 
const BILLING = 'BILLING';
const ADD = 'ADD'; 
const EDIT = 'EDIT';

const AddressSection = () => {
  const [globalState] = useGlobalContext();    
 

  const [state, setState] = useState({
    editAddress: "",
    SHIPPING: globalState.auth?.user?.shippingAddress?.[0] || {
      country: "",
      firstName: "",
      lastName: "",
      company: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      stateOrProvince: "",
      zip: "",
      phone: "",
    },
    BILLING: globalState.auth?.user?.billingAddress?.[0] || {
      country: "",
      firstName: "",
      lastName: "",
      company: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      stateOrProvince: "",
      zip: "",
      phone: "",
      allowNewsLetterSignUp: true,
      allowTextMessageOffers: false,
    },
  });
  
    return (
      <div className="bg-white w-full">
        <h2 className="text-xl font-semibold capitalize">addresses</h2>
        <div className="flex flex-col md:flex-row gap-10 mt-10">
          {!state.editAddress ? (
            <>
              <Section type={SHIPPING} state={state} setState={setState} />{" "}
              <Section type={BILLING} state={state} setState={setState} />
            </>
          ) : (
            <Section type={state.editAddress} state={state} setState={setState} />
          )}
        </div>
      </div>
    );   
}

export default AddressSection


const Section = ({ type, state, setState }) => {
  

    return (
      <div className="flex flex-col gap-5">
        <p className="capitalize font-semibold">
          {" "}
          {type.toLowerCase()} address
        </p>
        {state.editAddress === type ? (
          <AddressForm type={type} state={state} setState={setState}/>
        ) : (
          <div className="p-2 border border-gray-300">
            <div className="text-gray-500 italic">
              {!state[type].firstName ? (
                <p>No {type.toLowerCase()} address created yet</p>
              ) : (
                <div>
                  <p>
                    {state[type].firstName} {state[type].lastName}
                  </p>
                  <p>{state[type].addressLine1}</p>
                  <p>
                    {state[type].zip} {state[type].city}
                  </p>
                  <p>{state[type].country}</p>
                </div>
              )}
            </div>
            <button
              className="py-2 px-4 bg-gray-800 text-white capitalize mt-5"
              onClick={() =>
                setState((state) => ({
                  ...state,
                  editAddress: type,
                }))
              }
            >
              {state[type].firstName ? 'edit address': 'add new'}
            </button>
          </div>
        )}
      </div>
    );
}


const AddressForm = ({type, state, setState}) => {
 
  const [globalState, setGlobalState] = useGlobalContext();
  
  const [loading, setLoading] = useState(false);

  const inputChange = (e) =>
    setState((state) => ({
      ...state,
      [type]: { ...state[type], [e.target.name]: e.target.value },
    }));
 
  const mode =
    type === SHIPPING
      ? globalState.auth?.user?.shippingAddress?.[0]
        ? EDIT
        : ADD
      : globalState.auth?.user?.billingAddress?.[0]
      ? EDIT
      : ADD;  

 const addOrUpdateAddress = (e) =>
   catchASync(
     async () => {
       e.preventDefault();

       setLoading(true);
       const res =
         mode === ADD
           ? await Axios.post(
               `users/${
                 state.editAddress === SHIPPING
                   ? "shipping-address"
                   : "billing-address"
               }`, state[type]
             )
           : mode === EDIT &&
             await Axios.patch(
               `users/${
                 state.editAddress === SHIPPING
                   ? "shipping-address"
                   : "billing-address"
               }`, state[type]
             );
    
       setLoading(false);
       setState((state) => ({
         ...state, 
         editAddress: '',
         shippingAddress:
           state.editAddress === SHIPPING
             ? res.data.shippingAddress
             : state.shippingAddress,
         billingAddress:
           state.editAddress === BILLING
             ? res.data.billingAddress
             : state.billingAddress,
       })); 
       window.scroll({ top: 0 });
       
       setGlobalState((state) => ({
         ...state,
         alert: {
           ...state.alert,
           show: true,
           type: SUCCESS,
           text: res.data.message,
           timeout: 3000,
         },
       }));
     },
     setGlobalState,
     () => setLoading(false)
   );
    return (
      <form className="grid gap-3" onSubmit={addOrUpdateAddress}>
        <div className="grid gap-1">
          <label className="font-semibold" htmlFor="country">
            country *
          </label>
          <select
            name="country"
            id="country"
            value={state[type].country}
            onChange={inputChange}
            className="w-full bg-gray-200 p-2"
            required
          >
            <option value="">Country/Region</option>
            {countries.map((item, i) => (
              <option value={item.country} key={i}>
                {item.country}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="firstName">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              value={state[type].firstName}
              onChange={inputChange}
              className="bg-gray-200 p-2 "
              required
            />
          </div>
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="lastName">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              value={state[type].lastName}
              onChange={inputChange}
              className="bg-gray-200 p-2 "
              required
            />
          </div>
        </div>
        <div className="grid gap-1">
          <label className="font-semibold" htmlFor="company">
            company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            placeholder="Company"
            value={state[type].company}
            onChange={inputChange}
            className="bg-gray-200 p-2 "
          />
        </div>
        <div className="grid gap-1">
          <label className="font-semibold" htmlFor="addressLine1">
            Street or House *
          </label>
          <input
            type="text"
            name="addressLine1"
            id="addressLine1"
            placeholder="Street and house number"
            value={state[type].addressLine1}
            onChange={inputChange}
            className="bg-gray-200 p-2 "
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <FaExclamationCircle />
          <p>Add a house number if you have one</p>
        </div>
        <div className="grid gap-1">
          <label className="font-semibold" htmlFor="addressLine2">
            Apartment, suit, etc (optional)
          </label>
          <input
            type="text"
            name="addressLine2"
            id="addressLine2"
            placeholder="Apartment, suit, etc (optional)"
            value={state[type].addressLine2}
            onChange={inputChange}
            className="bg-gray-200 p-2 "
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="city">
              city *
            </label>
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City"
              value={state[type].city}
              onChange={inputChange}
              className="bg-gray-200 p-2 "
              required
            />
          </div>
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="stateOrProvince">
              State / Province *
            </label>
            <select
              name="stateOrProvince"
              id="stateOrProvince"
              value={state[type].stateOrProvince}
              onChange={inputChange}
              className="w-full bg-gray-200 p-2"
              required
            >
              <option value="">State/Province</option>
              {state[type].country &&
                countries[
                  countries.findIndex((i) => i.country === state[type].country)
                ]?.states.map((item, i) => (
                  <option value={item} className="" key={i}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="zip">
              Zip Code *
            </label>
            <input
              type="number"
              name="zip"
              id="zip"
              placeholder="Zip Code"
              value={state[type].zip}
              onChange={inputChange}
              className="bg-gray-200 p-2 w-full"
              required
            />
          </div>
        </div>
        <div className="grid gap-1">
          <label className="font-semibold" htmlFor="phone">
            Telephone (optional)
          </label>
          <input
            type="number"
            name="phone"
            id="phone"
            placeholder="Telephone"
            value={state[type].phone}
            onChange={inputChange}
            className="bg-gray-200 p-2 "
            min={0}
            minLength={8}
            maxLength={15}
          />
        </div>
        <div className="flex gap-5">
          <LoadingBtn
            loading={loading}
            className="py-2 px-4 bg-gray-800 text-white capitalize max-w-max"
          >
            {mode === ADD ? 'save address': 'update address'}
          </LoadingBtn>
          <button
            type="button"
            className="py-2 px-4 border border-gray-300 transition hover:bg-gray-800 hover:text-white capitalize max-w-max"
            onClick={() => {
              setState((state) => ({
                ...state,
                editAddress: "",
              }));
              window.scroll({ top: 0 });
            }}
          >
            cancel
          </button>
        </div>
      </form>
    );
}