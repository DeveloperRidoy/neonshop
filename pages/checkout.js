import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import CustomLink from "../components/CustomLink";
import PaymentSection from "../components/sections/checkout/paymentSection/PaymentSection";
import { useGlobalContext } from "../context/GlobalContext";
import Nav from "../components/nav/Nav";
import Footer from "../components/Footer";
import getLoggedInUser from "../utils/getLoggedInUser";
import connectDb from "../server/utils/connectDb";
import getUpdatedCart from "../server/utils/getUpdatedCart";
import CheckoutContext, {
  INFO_SECTION,
  PAYMENT_SECTION,
  useCheckoutContext,
} from "../context/CheckoutContext";
import InfoSection from "../components/sections/checkout/InfoSection";
import { colors } from "../utils/CustomNeonAssets";
import NeonPreview from "../components/NeonPreview";
import Head from "next/head";

const Checkout = () => {
  return (
    <CheckoutContext>
      <Container />
    </CheckoutContext>
  );
};

export default Checkout;

const Container = () => {
  const [state, setState] = useCheckoutContext();
  const [globalState] = useGlobalContext();
  const [showMobileSummary, setshowMobileSummary] = useState(false);
  
  const goToPaymentSection = (e) => {
    if(e) e.preventDefault();
    setState((state) => {
      // check if any requried field is empty
      const errors = { ...state.shipping.errors };
      const newErrors = [];
      const emailError = !state.email;
      Object.keys(state.shipping.errors).forEach((key) => {
        if (!state.shipping[key]) newErrors.push(key);
      });

      if (emailError || newErrors.length > 0) {
        newErrors.forEach((item) => (errors[item] = `${item} is required`));
        const scrollTarget = document.getElementById(
          emailError ? "email" : newErrors[0]
        );
        window.scrollTo(0, scrollTarget.offsetTop - 40);
        return {
          ...state,
          errors: {
            ...state.errors,
            email: emailError ? "email is required" : "",
          },
          shipping: { ...state.shipping, errors },
        };
      }

      window.scrollTo(0, 0);
      return { ...state, activeSection: PAYMENT_SECTION };
    });
  };
  return (
    <div className="">
      <Head>
        <title>Checkout | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {globalState.cartData.cart?.items?.length > 0 ||
      globalState.cartData.cart?.customItems?.length > 0 > 0 ? (
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">
            <div
              className="py-16 px-20 text-white text-center"
              style={{
                background:
                  "linear-gradient(rgba(0, 0, 0,0.87), rgba(0, 0, 0,0.87)), url('/img/neon-banner-5.jpg')",
              }}
            >
              <CustomLink className="text-3xl md:text-6xl" text="NeonSignCo" />
              <div className="flex items-center justify-center gap-3 md:gap-5 mt-5">
                <CustomLink href="/cart" text="Cart" />
                <FaChevronRight />
                <button
                  className={`${
                    state.activeSection === INFO_SECTION ? "font-semibold" : ""
                  }`}
                  onClick={() =>
                    setState((state) => ({
                      ...state,
                      activeSection: INFO_SECTION,
                    }))
                  }
                >
                  Info
                </button>
                <FaChevronRight />
                <button
                  className={`${
                    state.activeSection === PAYMENT_SECTION
                      ? "font-semibold"
                      : ""
                  }`}
                  onClick={goToPaymentSection
                  }
                  
                >
                  Payment
                </button>
              </div>
            </div>
            <div className="px-5 lg:px-12 pt-10 grid gap-10">
              <button
                className="lg:hidden border border-gray-300 py-2 flex items-center justify-center gap-2"
                onClick={() => setshowMobileSummary((bool) => !bool)}
              >
                <span>Cart Summary</span>
                <FaChevronDown
                  className={`transition ${
                    showMobileSummary ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showMobileSummary && <CartPreview />}
              {state.activeSection === INFO_SECTION ? (
                <InfoSection goToPaymentSection={goToPaymentSection}/>
              ) : (
                <PaymentSection />
              )}

              <div className="flex justify-center md:justify-start items-center p-2 border-t border-gray-300 gap-8 capitalize">
                <CustomLink href="/privacy-policy" text="privacy policy" />
                <CustomLink href="/refund-policy" text="refund policy" />
                <CustomLink
                  href="/terms-conditions"
                  text="terms and conditions"
                />
              </div>
            </div>
          </div>
          <div className="hidden lg:block min-w-[450px] px-4 py-10 ">
            <div className="sticky top-0">
              <CartPreview />
            </div>
          </div>
        </div>
      ) : (
        <CartEmptySection />
      )}
    </div>
  );
};

const CartPreview = () => {
  const [globalState] = useGlobalContext();
  return (
    <div>
      <div className="grid gap-2">
        {globalState.cartData.cart?.customItems?.map((item) => (
          <CartCustomItem item={item} key={item._id} />
        ))}
        {globalState.cartData.cart?.items?.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>
      <div className="h-[2px] bg-black/10 my-5"></div>
      <div className="flex gap-5  ">
        <input
          type="text"
          placeholder="Gift card or discount code"
          className="border border-gray-300 p-3 w-full"
        />
        <button className="py-4 px-6 text-lg uppercase bg-black text-white">
          apply
        </button>
      </div>
      <div className="h-[2px] bg-black/10 my-5"></div>
      <div className="flex justify-between">
        <p className="capitalize">subtotal</p>
        <p>${globalState.cartData.cart?.subTotal}</p>
      </div>
      <div className="flex justify-between">
        <p className="capitalize">Shipping</p>
        <p className="uppercase">FREE</p>
      </div>
      {globalState.cartData.cart?.discount ? (
        <div className="flex justify-between">
          <p className="capitalize">discount</p>
          <p className="uppercase font-semibold text-lg">
            -{globalState.cart?.discount}
          </p>
        </div>
      ) : (
        ""
      )}
      <div className="h-[2px] bg-black/10 my-5"></div>
      <div className="flex justify-between">
        <p className="capitalize">total</p>
        <div className="flex items-center gap-1">
          <div className="text-3xl">
            ${globalState.cartData.cart?.total || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ item }) => {
  const price =
    item.product.sizes.find((size) => size._id === item.selectedSize.sizeId)
      ?.price || item.selectedSize.price;
  const salePrice =
    item.product.salePercentage > 0
      ? price - (price * item.product.salePercentage) / 100
      : price;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="relative">
        <div>
          <img
            src={item.product.images?.[0]?.url}
            alt="product"
            className="w-16 h-16 rounded object-cover"
          />
        </div>
        <span className="absolute -top-1 -right-2 bg-gray-500 h-5 w-5 rounded-full text-white flex justify-center items-center">
          {item.count}
        </span>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="font-semibol capitalize text-xl">{item.name}</div>
        <div className="capitalize text-sm flex flex-wrap items-center gap-2">
          <div className="font-semibold">color:</div>{" "}
          <div className="uppercase flex items-center gap-1">
            <div>{item.selectedColor.name}</div>
          </div>
          | <div className="font-semibold">size:</div>{" "}
          <div className="uppercase">{item.selectedSize.info}</div> |{" "}
          <div className="font-semibold">mount:</div>{" "}
          <div className="uppercase">{item.selectedMountType}</div>
        </div>
      </div>
      <div className="flex h-full items-center justify-center">
        <span className="text-">${item.count * salePrice}</span>
      </div>
    </div>
  );
};
const CartCustomItem = ({ item }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="relative">
          <NeonPreview
            text={item.text}
            color={colors.find((color) => color.hex === item.color.hex)}
            icon={item.icon}
            font={item.font}
            className="h-16 w-16 rounded bg-black overflow-hidden"
            textClass=" text-3xl md:text-xl "
            iconClass="h-10"
            hideWidth
          />
          <span className="absolute -top-1 -right-2 bg-gray-500 h-5 w-5 rounded-full text-white flex justify-center items-center">
            {item.count}
          </span>
        </div>
        <p className="capitalize">Custom neon</p>
      </div>
      <div className="flex h-full items-center justify-center">
        <span className="text-">${item.count * item.price}</span>
      </div>
    </div>
  );
};

const CartEmptySection = () => {
  return (
    <div className="">
      <Nav />
      <div className="py-20">
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

      <Footer />
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
        user: JSON.parse(JSON.stringify(user)),
        cart: JSON.parse(JSON.stringify(cart)),
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
