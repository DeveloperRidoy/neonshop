import { BsDash, BsPlus } from "react-icons/bs";
import CustomLink from "../components/CustomLink";
import { Loader } from "../components/LoadingBtn";
import FollowSection from "../components/sections/FollowSection";
import NewsLetterSection from "../components/sections/NewsLetterSection";
import { ERROR, useGlobalContext } from "../context/GlobalContext";
import connectDb from "../server/utils/connectDb";
import getUpdatedCart from "../server/utils/getUpdatedCart";
import Axios from "../utils/Axios";
import { colors } from "../utils/CustomNeonAssets";
import getLoggedInUser from "../utils/getLoggedInUser";
import NeonPreview from "../components/NeonPreview";
import Head from "next/head";

const CartPage = () => {
  const [globalState] = useGlobalContext();
  return (
    <div className=" pt-20">
      <div className="px-5 lg:px-20">
        <h1 className="text-2xl sm:text-5xl text-center uppercase font-semibold mb-10">
          cart
        </h1>
        {globalState.cartData.cart?.items?.length > 0 ||
        globalState.cartData.cart?.customItems?.length > 0 ? (
          <div className="flex flex-col lg:flex-row  gap-5 bg-gray-100">
            <div className="flex lg:self-start flex-col gap-4 bg-gray-200 p-2">
              {globalState.cartData.cart?.customItems?.map((item) => (
                <CartCustomItem item={item} key={item._id} />
              ))}
              {globalState.cartData.cart?.items?.map((item) => (
                <CartItem item={item} key={item._id} />
              ))}
            </div>
            <div className="w-full md:w-[500px] mx-auto">
              <div className="sticky top-20 bg-white px-4 grid gap-2">
                <h3 className="text-3xl uppercase text-center border-b pb-2 border-gray-300">
                  summary
                </h3>
                <div className="flex justify-between">
                  <p className="capitalize text-lg">subtotal</p>
                  <p className="text-xl ">
                    ${globalState.cartData.cart.subTotal}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="capitalize text-lg">shipping</p>
                  <p className="text-xl uppercase">free</p>
                </div>
                <div className="flex justify-between">
                  <p className="capitalize text-lg ">total</p>
                  <p className="text-xl uppercase">
                    ${globalState.cartData.cart.subTotal}
                  </p>
                </div>
                <CustomLink
                  href="/checkout"
                  className="py-3 px-7 w-full transition bg-black text-white flex justify-center items-center text-lg uppercase gap-3"
                >
                  <span>checkout</span>
                  {globalState.cartData.loading && <Loader />}
                </CustomLink>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-5">
            {" "}
            <h1 className="text-center text-xl  md:text-3xl mb-5">
              your cart is empty!
            </h1>{" "}
            <div className="flex flex-col sm:flex-row gap-3 items-center sm:justify-center">
              <CustomLink
                href="/shop"
                text="shop now"
                className="h-12 w-52 flex items-center justify-center bg-black text-white uppercase font-semibold transition hover:text-gray-200"
              />
              <CustomLink
                text="custom neon sign"
                href="/custom-neon-sign"
                className="h-12 w-52 flex items-center justify-center bg-white text-black border border-black uppercase font-semibold transition hover:bg-black hover:text-white"
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-20">
        <NewsLetterSection />
        <FollowSection />
      </div>
    </div>
  );
};

export default CartPage;

const CartItem = ({ item }) => {
  const [globalState, setGlobalState] = useGlobalContext();

  const updateCart = async ({ plus = true, remove = false }) => {
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
          remove ? (i.count = 0) : plus ? (i.count += 1) : (i.count -= 1);
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
  };

  const link = `shop/${item.product.category.slug}/${item.product.slug}`;
  return (
    <div className="flex flex-col md:flex-row gap-2 bg-white p-2">
      <CustomLink href={link}>
        <img
          src={item.product.images?.[0]?.url}
          alt="product"
          className="w-full md:w-60 object-cover"
        />
      </CustomLink>
      <div className="flex flex-col gap-3 flex-1">
        <CustomLink href={link} className="font-semibol capitalize text-2xl">
          {item.product.name}
        </CustomLink>
        <div className="capitalize text-sm flex flex-wrap items-center gap-2">
          <div className="font-semibold">color:</div>{" "}
          <div className="uppercase">{item.selectedColor.name}</div>|{" "}
          <div className="font-semibold">size:</div>{" "}
          <div className="uppercase">{item.selectedSize.info}</div> |{" "}
          <div className="font-semibold">mount:</div>{" "}
          <div className="uppercase">{item.selectedMountType}</div>
        </div>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="h-7 w-7 flex items-center justify-center bg-gray-300 transition hover:bg-black hover:text-white text-5xl disabled:bg-gray-300 disabled:text-black disabled:cursor-text"
              onClick={() => updateCart({ plus: false })}
              disabled={item.count === 1}
            >
              <BsDash />
            </button>
            <p className="text-2xl">{item.count}</p>
            <button
              className="h-7 w-7 flex items-center justify-center bg-gray-300 transition hover:bg-black hover:text-white text-5xl"
              onClick={updateCart}
            >
              <BsPlus />
            </button>
          </div>
          <p className="font-semibold">
            ${item.selectedSize.price * item.count}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            className="py-1 px-2 bg-gray-200 transition hover:bg-black hover:text-white"
            onClick={() => updateCart({ remove: true })}
          >
            remove
          </button>
        </div>
      </div>
    </div>
  );
};

const CartCustomItem = ({ item }) => {
  const [globalState, setGlobalState] = useGlobalContext();

  const updateCart = async ({ plus = true, remove = false }) => {
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
          remove ? (i.count = 0) : plus ? (i.count += 1) : (i.count -= 1);
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
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 bg-white p-2">
      <Head>
        <title>Cart | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NeonPreview
        text={item.text}
        color={colors.find((color) => color.hex === item.color.hex)}
        icon={item.icon}
        font={item.font}
        iconClass="h-10 lg:h-10"
        textClass="text-5xl md:text-3xl"
        className="py-5 w-full md:w-60 bg-black overflow-hidden "
        iconClass="h-20"
        hideWidth
      />
      <div className="flex flex-col gap-3 flex-1">
        <h2 className="font-semibol capitalize text-2xl">custom neon</h2>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="h-7 w-7 flex items-center justify-center bg-gray-300 transition hover:bg-black hover:text-white text-5xl disabled:bg-gray-300 disabled:text-black disabled:cursor-text"
              onClick={() => updateCart({ plus: false })}
              disabled={item.count === 1}
            >
              <BsDash />
            </button>
            <p className="text-2xl">{item.count}</p>
            <button
              className="h-7 w-7 flex items-center justify-center bg-gray-300 transition hover:bg-black hover:text-white text-5xl"
              onClick={updateCart}
            >
              <BsPlus />
            </button>
          </div>
          <p className="font-semibold">${item.count * item.price}</p>
        </div>
        <div className="flex justify-end">
          <button
            className="py-1 px-2 bg-gray-200 transition hover:bg-black hover:text-white"
            onClick={() => updateCart({ remove: true })}
          >
            remove
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  try {
    await connectDb();
    const user = await getLoggedInUser(req);

    const cart = await getUpdatedCart({
      userId: user?._id,
      tempUserId: req.cookies.tempUserId,
    });

    return {
      props: {
        user: user ? JSON.parse(JSON.stringify(user)) : null,
        cart: cart ? JSON.parse(JSON.stringify(cart)) : null,
        serverRendered: true,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: { code: 500, message: "server error" },
      },
    };
  }
};
