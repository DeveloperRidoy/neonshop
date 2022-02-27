import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { AFTERPAY, CREDIT_CARD, INFO_SECTION, useCheckoutContext } from "../../../../context/CheckoutContext";
import { useGlobalContext } from '../../../../context/GlobalContext';
import LoadingBtn from "../../../LoadingBtn";
import catchAsync from '../../../../utils/catchASync';
import Axios from '../../../../utils/Axios';
import PayPalPayment from "./PayPalPayment";

const PaymentSection = () => {
  const [globalState, setGlobalState] = useGlobalContext();
  const [state, setState] = useCheckoutContext();
  const [loading, setLoading] = useState(false);


  const completeOrder = () => catchAsync(async () => { 
    setLoading(true); 

    const res = await Axios.post("stripe/checkout-session", {
      cartId: globalState.cartData.cart._id,
      shippingAddress: state.shipping,
      contactEmail: state.email,
      paymentMethod:
      state.paymentMethod === CREDIT_CARD ? "card" : state.paymentMethod === AFTERPAY && "afterpay_clearpay",
    });

    setLoading(false)
    window.location.href = res.data.sessionUrl;
  }, setGlobalState, () => setLoading(false));


  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <div className="flex flex-wrap justify-between items-center gap-2 p-2 border border-b-0  border-gray-400 rounded-t">
          <div className="flex flex-col md:flex-row">
            <div className="font-semibold w-40">Contact</div>
            <div className="flex-1">{state.email}</div>
          </div>
          <button
            onClick={() =>
              setState((state) => ({
                ...state,
                activeSection: INFO_SECTION,
                activeElement: "email",
              }))
            }
          >
            change
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2 p-2 border  border-gray-400">
          <div className="flex flex-col md:flex-row">
            <div className="font-semibold w-40">Shipping Address</div>
            <div className="flex-1">
              {state.shipping.addressLine1}, {state.shipping.stateOrProvince}{" "}
              {state.shipping.zip}, {state.shipping.country}
            </div>
          </div>
          <button
            onClick={() =>
              setState((state) => ({
                ...state,
                activeSection: INFO_SECTION,
                activeElement: "addressLine1",
              }))
            }
          >
            change
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2 p-2 border border-t-0 rounded-b  border-gray-400">
          <div className="flex flex-col md:flex-row">
            <div className="font-semibold w-40">Method</div>
            <div className="flex-1">
              10-20 Days (the majority of our past orders were delivered in
              under 2 weeks) · Free
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-semibold capitalize">payment</h2>
        <p>All transactions are secure and encrypted.</p>
        <div className="grid">
          <button
            className="px-4 py-1 flex flex-wrap items-center justify-between border border-b-0  border-gray-400 rounded-t"
            onClick={() =>
              setState((state) => ({ ...state, paymentMethod: CREDIT_CARD }))
            }
          >
            <div className="flex gap-4 items-center">
              <input
                type="radio"
                checked={state.paymentMethod === CREDIT_CARD}
                onChange={() => {}}
                className="scale-[1.5]"
              />
              <div className="font-semibold capitalize"> credit card</div>
            </div>
            <div className="flex gap-2 items-center">
              <img
                src="/img/card-icons/visa.svg"
                alt="visa credit card"
                className="h-12"
              />
              <img
                src="/img/card-icons/master.svg"
                alt="master credit card"
                className="h-12"
              />
              <img
                src="/img/card-icons/amex.svg"
                alt="amex credit card"
                className="h-12"
              />
              <img
                src="/img/card-icons/discover.svg"
                alt="discover credit card"
              />
              <span>and more...</span>
            </div>
          </button>
          <button
            className="px-4 py-3 flex items-center gap-4 border rounded-b border-gray-400"
            onClick={() =>
              setState((state) => ({ ...state, paymentMethod: AFTERPAY }))
            }
          >
            <div className="flex gap-4 items-center">
              <input
                type="radio"
                id="credit-card"
                checked={state.paymentMethod === AFTERPAY}
                onChange={() => {}}
                className="scale-[1.5]"
              />{" "}
              <label htmlFor="credit-cart" className="font-semibold capitalize">
                <img
                  src="/img/card-icons/afterpay.svg"
                  alt="afterpay"
                  className="h-8"
                />
              </label>
            </div>
          </button>
          <div className=" border border-t-0 rounded-b  border-gray-400"></div>
        </div>
        <div className="h-[1px] bg-black w-20 mx-auto"></div>
        <PayPalPayment />
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-5 md:justify-between mt-5">
        <button
          className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-400 transition hover:bg-black hover:text-white"
          onClick={() => {
            setState((state) => ({ ...state, activeSection: INFO_SECTION }));
            window.scroll({ top: 0 });
          }}
        >
          <FaChevronLeft />
          <p>Return to info</p>
        </button>
        <LoadingBtn
          loading={loading}
          className="py-2 px-4 bg-black text-white uppercase tracking-widest transition hover:bg-gray-900"
          onClick={completeOrder}
        >
          complete order
        </LoadingBtn>
      </div>
    </div>
  );
}

export default PaymentSection
