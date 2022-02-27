import { motion } from "framer-motion"
import { useEffect } from "react";
import { FaChevronRight, FaMinus, FaPlane, FaPlus } from "react-icons/fa"
import { ERROR, useGlobalContext } from "../context/GlobalContext";
import Axios from "../utils/Axios";
import { colors } from "../utils/CustomNeonAssets";
import CustomLink from "./CustomLink";
import { Loader } from "./LoadingBtn";
import NeonPreview from "./NeonPreview";

const CartPreview = () => {
    const [globalState, setGlobalState] = useGlobalContext();
  
  
    // close preview on escape key
    useEffect(() => {
        const listener = (e) => e.key === 'Escape' &&
          setGlobalState((state) => ({
            ...state,
           cartData: {...state.cartData, show: false}
          }));
        document.addEventListener('keydown', listener);
        return () => document.removeEventListener('keydown', listener);
    }, [])

  
    return (
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, x: "100%", transition: { duration: 0.3 } }}
        className=" fixed top-0 right-0 h-screen z-40 w-full sm:w-auto h-full bg-white "
      >
        <div className="bg-white w-full sm:w-[370px] flex flex-col justify-between h-full">
          <button
            className="flex items-center text-white bg-gray-800 p-3 w-full"
            onClick={() =>
              setGlobalState((state) => ({
                ...state,
                cartData: { ...state.cartData, show: false },
              }))
            }
          >
            <div className=" uppercase flex-1 flex items-center justify-center   gap-4">
              <p>free shipping</p>
              <FaPlane />
            </div>
            <FaChevronRight />
          </button>
          <div className="flex-1 h-full overflow-hidden ">
            {globalState.cartData.cart?.items?.length > 0 ||
            globalState.cartData.cart?.customItems?.length > 0 ? (
              <div className="flex flex-col h-full">
                <div className="overflow-auto p-2 bg-gray-200 flex flex-col gap-4">
                  {globalState.cartData.cart?.customItems?.map((item) => (
                    <CartCustomItem item={item} key={item._id} />
                  ))}
                  {globalState.cartData.cart?.items?.map((item) => (
                    <CartItem item={item} key={item._id} />
                  ))}
                </div>
                <div className="flex-1 p-3 pt-5 flex flex-col gap-3 ">
                  <div className="flex flex-wrap justify-between">
                    <p className="font-semibold uppercase">subtotal</p>
                    <p className="font-semibold">
                      {globalState.cartData.cart?.subTotal}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <p className="font-semibold uppercase">shipping</p>
                    <p className="font-semibold uppercase">free</p>
                  </div>
                  <CustomLink
                    href="/checkout"
                    className="p-2 w-full bg-black text-white uppercase font-semibold transition flex items-center gap-2 justify-center"
                    onClick={() =>
                      setGlobalState((state) => ({
                        ...state,
                        cartData: { ...state.cartData, show: false },
                      }))
                    }
                  >
                    <span className="">checkout </span>
                    {globalState.cartData.loading && <Loader />}
                  </CustomLink>
                  <CustomLink
                    href="/cart"
                    className="w-full bg-white p-2 uppercase border border-gray-400 font-semibold text-center transition hover:bg-black hover:text-white"
                    onClick={() =>
                      setGlobalState((state) => ({
                        ...state,
                        cartData: { ...state.cartData, show: false },
                      }))
                    }
                  >
                    view cart
                  </CustomLink>
                </div>
              </div>
            ) : globalState.cartData.loading ? (
              <div className="mt-20 max-w-max mx-auto">
                <Loader borderColor="border-black" />
              </div>
            ) : (
              <div className="flex flex-col items-center h-full bg-white gap-3 p-2">
                <h3 className="text-xl sm:text-3xl uppercase my-4">
                  your cart is empty
                </h3>
                <p className="text-center">
                  Ever wanted to create your dream neon?
                </p>
                <CustomLink
                  href="/custom-neon-sign"
                  className="px-6 py-3 uppercase bg-black text-white tracking-widest"
                  onClick={() =>
                    setGlobalState((state) => ({
                      ...state,
                      cartData: { ...state.cartData, show: false },
                    }))
                  }
                >
                  start creating now
                </CustomLink>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
}

export default CartPreview


const CartItem = ({ item }) => {
    const [globalState, setGlobalState] = useGlobalContext();
  const updateCart = async ({ plus = true }) => {
    try {
      setGlobalState((state) => ({
        ...state,
        cartData: { ...state.cartData, loading: true },
      }));

      const itemsCopy = JSON.parse(
        JSON.stringify(globalState.cartData.cart.items)
      );
      const updatedItems = itemsCopy.map((i) => {
        if (i._id === item._id) {
          plus ? (i.count += 1) : (i.count -= 1);
        }
        return i;
      });

      const res = await Axios.patch("cart", {
        ...globalState.cartData.cart,
        items: updatedItems,
      });

      setGlobalState((state) => ({
        ...state,
        cartData: {
          ...state.cartData,
          loading: false,
          cart: res.data.cart,
        },
      }));
    } catch (error) {
      setGlobalState((state) => ({
        ...state,
        alert: {
          ...state.alert,
          show: true,
          text:
            error.response?.data.message || error.message || "network error",
          type: ERROR,
          timeout: 5000,
        },
        cartData: {
          ...state.cartData,
          loading: false,
        },
      }));
    }
  } 

    return (
      <div className="flex items-center gap-2 bg-white p-2">
        <CustomLink
          href={`/shop/${item.product?.category?.slug}/${item.product?.slug}`}
          onClick={() =>
            setGlobalState((state) => ({
              ...state,
              cartData: { ...state.cartData, show: false },
            }))
          }
        >
          <img
            src={item.product.images?.[0]?.url}
            alt={item.product.name}
            className="h-20 w-20 object-cover"
          />
        </CustomLink>
        <div className="flex flex-col justify-between flex-1">
          <h3 className="font-semibold capitalize">{item.name}</h3>
          <div className="capitalize text-sm flex flex-wrap items-center gap-1">
            <div className="font-semibold">color:</div>{" "}
            <div className="flex items-center gap-1">
              <div className="font-semibold">Color: </div>{" "}
              <div>{item.selectedColor.name}</div>
            </div>
            | <div className="font-semibold">size:</div>{" "}
            <div className="uppercase">{item.selectedSize.info}</div> |{" "}
            <div className="font-semibold">mount:</div>{" "}
            <div className="uppercase">{item.selectedMountType}</div>
          </div>
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                className="h-5 w-5 flex items-center justify-center bg-gray-300 transition hover:bg-black hover:text-white text-[10px]"
                onClick={() => updateCart({ plus: false })}
              >
                <FaMinus />
              </button>
              <p>{item.count}</p>
              <button
                className="h-5 w-5 flex items-center justify-center bg-gray-300 transition hover:bg-black hover:text-white text-[10px]"
                onClick={updateCart}
              >
                <FaPlus />
              </button>
            </div>
            <p className="font-semibold">
              ${item.selectedSize.price * item.count}
            </p>
          </div>
        </div>
      </div>
    );
}


const CartCustomItem = ({ item }) => {
  const [globalState, setGlobalState] = useGlobalContext();

  const updateCart = async ({ plus = true }) => {
    try {
      setGlobalState((state) => ({
        ...state,
        cartData: { ...state.cartData, loading: true },
      }));

      const itemsCopy = JSON.parse(
        JSON.stringify(globalState.cartData.cart.customItems)
      );
      const updatedItems = itemsCopy.map((i) => {
        if (i._id === item._id) {
          plus ? (i.count += 1) : (i.count -= 1);
        }
        return i;
      });

      const res = await Axios.patch("cart", {
        ...globalState.cartData.cart,
        customItems: updatedItems,
      });

      setGlobalState((state) => ({
        ...state,
        cartData: {
          ...state.cartData,
          loading: false,
          cart: res.data.cart,
        },
      }));
    } catch (error) {
       setGlobalState((state) => ({
         ...state,
         alert: {
           ...state.alert,
           show: true,
           text:
             error.response?.data.message || error.message || "network error",
           type: ERROR,
           timeout: 5000,
         },
         cartData: {
           ...state.cartData,
           loading: false,
         },
       }));
    }
  }

  return (
    <div className="flex items-center gap-2 bg-white p-2">
      <NeonPreview
        text={item.text}
        color={colors.find((color) => color.hex === item.color.hex)}
        icon={item.icon}
        font={item.font}
        textClass="text-xl"
        className="h-20 w-20 bg-black text-xl overflow-hidden "
        iconClass="h-6 lg:h-10 "
        hideWidth
      />
      <div className="flex flex-col justify-between flex-1">
        <h3 className="font-semibold capitalize">custom neon</h3>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="h-5 w-5 flex items-center justify-center bg-gray-300 transition hover:bg-black hover:text-white text-[10px]"
              onClick={() => updateCart({ plus: false })}
            >
              <FaMinus />
            </button>
            <p>{item.count}</p>
            <button
              className="h-5 w-5 flex items-center justify-center bg-gray-300 transition hover:bg-black hover:text-white text-[10px]"
              onClick={updateCart}
            >
              <FaPlus />
            </button>
          </div>
          <p className="font-semibold">${item.count * item.price}</p>
        </div>
      </div>
    </div>
  );
};
