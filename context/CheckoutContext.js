import { createContext, useContext, useState } from "react";
import { useGlobalContext } from './GlobalContext'

// variables 
export const INFO_SECTION = 'INFO_SECTION';
export const PAYMENT_SECTION = 'PAYMENT_SECTION';
export const SHIPPING= "SHIPPING";
export const BILLING = "BILLING";
export const CREDIT_CARD = 'CREDIT_CARD'; 
export const AFTERPAY = 'AFTERPAY'; 


const Context = createContext();
export const useCheckoutContext = () => useContext(Context);

const CheckoutContext = ({ children }) => {
  const [globalState] = useGlobalContext();
  const userShipping = globalState.auth.user?.shippingAddress?.[0];
    const [state, setState] = useState({
      activeSection: INFO_SECTION,  
      activeElement: '',
      paymentMethod: CREDIT_CARD,
      email: globalState.auth.user?.email || "",
      allowNewsLetterSignUp: true,
      allowTextMessageOffers: false, 
      shipping: {
        country: userShipping?.country || '',
        firstName: userShipping?.firstName || '',
        lastName: userShipping?.lastName || '',
        company: userShipping?.company || '',
        addressLine1: userShipping?.addressLine1 || '',
        addressLine2: userShipping?.country || '',
        city: userShipping?.city || '',
        stateOrProvince: userShipping?.stateOrProvince || '',
        zip: userShipping?.zip || '',
        phone: userShipping?.phone || '',
        errors: {
          country: "",
          firstName: "",
          lastName: "",
          addressLine1: "",
          city: "",
          stateOrProvince: "",
          zip: "",
        },
      },
      errors: {
        email: "",
      },
    });



  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default CheckoutContext;
