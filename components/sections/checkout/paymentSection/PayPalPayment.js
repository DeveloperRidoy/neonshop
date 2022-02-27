import { PayPalButton } from "react-paypal-button-v2";
import { ERROR, useGlobalContext } from "../../../../context/GlobalContext";
import Axios from '../../../../utils/Axios';           
import { useRouter } from 'next/router'
import { useCheckoutContext } from "../../../../context/CheckoutContext";
const PayPalPayment = () => {
  const [globalState, setGlobalState] = useGlobalContext();
  const [state] = useCheckoutContext();
  const Router = useRouter();
  const cartId = globalState.cartData?.cart?._id;
 
  const createOrder = async (data, actions) => {
    try {
      // create order with status of PENDING_PAYMENT
      const res = await Axios.post("orders/paypal/create-order", {
        cartId,
        shippingAddress: state.shipping,
        contactEmail: state.email,
      });

      const order = actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: globalState.cartData.cart.total,
            },
            reference_id: res.data.orderId,
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      });

      return order;
    } catch (error) {
      setGlobalState((state) => ({
        ...state,
        alert: { show: true, text: error.response?.data.message || error.message || 'network error' , type: ERROR, timeout: 5000 },
      }));
    }
  };

  const onApprove = async (data, actions) => {
    try {
      // capture order
      const details = await actions.order.capture();

    //   update order status to ORDERED
       await Axios.post("orders/paypal/capture-order", {
        orderId: details.purchase_units[0].reference_id,
      });

    // clear cart 
        setGlobalState(state => ({...state, cartData: {...state.cartData, cart: null}}))
        
    //   redirect to thank you page 
        Router.replace(`thank-you?ordered=true`)
      
    } catch (error) {
      setGlobalState((state) => ({
        ...state,
        alert: {
          show: true,
          text: error.response?.data.message || error.message || "network error",
          type: ERROR,
          timeout: 5000,
        },
      }));
    }
  };



  return (
    <div className="md:min-w-[500px] md:mx-auto">
      <PayPalButton
        style={{
          shape: "rect",
          color: "black",
          layout: "horizontal",
          tagline: false,
        }}
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, commit: true }}
        createOrder={createOrder}
        onApprove={onApprove}  
      />
    </div>
  );
};

export default PayPalPayment;



