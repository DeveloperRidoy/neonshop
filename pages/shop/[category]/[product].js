import { BsPlus, BsDash } from "react-icons/bs";
import BreadCrumb from "../../../components/BreadCrumb";
import { useState } from "react";
import { useGlobalContext } from "../../../context/GlobalContext";
import NewsLetterSection from "../../../components/sections/NewsLetterSection";
import FollowSection from "../../../components/sections/FollowSection";
import { AnimatePresence, motion } from "framer-motion";
import CustomLink from "../../../components/CustomLink";
import ContactForm from "../../../components/forms/ContactForm";
import connectDb from "../../../server/utils/connectDb";
import Product from "../../../server/models/product";
import Category from "../../../server/models/category";
import LoadingBtn, { Loader } from "../../../components/LoadingBtn";
import { useRouter } from "next/router";
import catchASync from "../../../utils/catchASync";
import Axios from "../../../utils/Axios";
import Head from "next/head";
import { colors } from "../../../utils/CustomNeonAssets";
import ImageSlider from "../../../components/sliders/imageSlider";

const mountTypes = ["WALL", "HANGING"];

const ProductPage = ({ product }) => {
  const [globalState, setGlobalState] = useGlobalContext();
  const [showForm, setShowForm] = useState(false);
  const [state, setState] = useState({
    color: "",
    size: "",
    quantity: 1,
    mountType: "",
    errors: {
      color: "",
      size: "",
      mountType: "",
      quantity: "",
    },
  });

  const addToCart = () =>
    catchASync(
      async () => {
        // check if all options are selected
        if (
          !state.color ||
          !state.size.info ||
          !state.mountType ||
          !state.quantity
        ) {
          setState((state) => ({
            ...state,
            errors: {
              color: !state.color ? "Please select a color" : "",
              size: !state.size.info ? "Please select a size" : "",
              mountType: !state.mountType ? "Please select mount type" : "",
              quantity: !state.quantity ? "Please select quantity" : "",
            },
          }));

          // scroll to error point
          const scrollTarget = document.getElementById(
            !state.color.hex
              ? "color"
              : !state.size.name
              ? "size"
              : !state.mountType
              ? "mount-type"
              : !state.quantity && "quantity"
          );
          window.scrollTo(0, scrollTarget.offsetTop - 70);
          return;
        }

        setGlobalState((state) => ({
          ...state,
          cartData: {
            ...state.cartData,
            loading: true,
          },
        }));

        const data = {
          product,
          selectedColor: state.color,
          selectedMountType: state.mountType,
          selectedSize: {
            info: state.size.info,
            price: state.size.price,
            sizeId: state.size._id,
          },
          count: state.quantity,
        };

        let res;

        if (
          globalState.cartData.cart?.items?.length > 0 ||
          globalState.cartData.cart?.customItems?.length > 0
        ) {
          res = await Axios.patch("cart", {
            customItems: globalState.cartData.cart?.customItems,
            items: [...globalState.cartData.cart?.items, data],
          });
        } else {
          res = await Axios.post("cart", { items: [data] });
        }

        setGlobalState((state) => ({
          ...state,
          cartData: {
            ...state.cartData,
            loading: false,
            show: true,
            cart: res.data.cart,
          },
        }));
      },
      setGlobalState,
      () =>
        setGlobalState((state) => ({
          ...state,
          cartData: { ...state.cartData, loading: false },
        }))
    );

  if (useRouter().isFallback)
    return (
      <div className="h-screen grid place-content-center">
        <Loader borderColor="border-black" />
      </div>
    );

  const currentSize = state.size || product.sizes[0];
  const discountPrice =
    product.salePercentage > 0
      ? currentSize.price - (currentSize.price * product.salePercentage) / 100
      : currentSize.price;

  return (
    <div className=" pt-10">
      <Head>
        <title>{product.name} | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-5 lg:px-20 mb-4">
        <BreadCrumb />
      </div>
      <div className="px-5 lg:px-20 flex flex-col md:flex-row items-start gap-7">
        <div
          className={`w-full md:max-w-[400px] md:sticky ${
            globalState.showBanner ? "top-[102px]" : "top-[62px]"
          }`}
        >
          {product.salePercentage > 0 && (
            <div className="absolute bg-red-500 py-1 px-2 text-white z-10">
              -{product.salePercentage}%
            </div>
          )}
          {product.images?.length > 1 ? (
            <ImageSlider
              images={product.images.map((image) => ({
                url: image.url,
                alt: product.name,
              }))}
            />
          ) : (
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="w-full object-cover"
            />
          )}
        </div>
        <div className="grid gap-5  w-full">
          <h1 className="text-3xl font-semibold uppercase">{product.name}</h1>
          {product.salePercentage > 0 ? (
            <div className="flex items-center font-semibold text-2xl text-gray-600">
              <p>$</p>
              <p>{discountPrice}</p>
              <p className="relative">
                <span className="absolute left-1 -top-5 text-[17px] line-through  text-red-500">
                  ${currentSize.price}
                </span>
              </p>
            </div>
          ) : (
            <p className="flex items-center font-semibold text-2xl text-gray-600">
              <span>$</span>
              <span>{currentSize.price}</span>
            </p>
          )}

          <div id="color">
            <h3 className="uppercase font-semibold mb-1">
              {!state.errors.color ? (
                "color"
              ) : (
                <span className="text-red-500">{state.errors.color}</span>
              )}
            </h3>
            <select
              value={state.color?.hex}
              className="bg-gray-200 p-2 capitalize"
              onChange={(e) =>
                setState((state) => ({
                  ...state,
                  color: colors.find((color) => color.hex === e.target.value),
                  errors: { ...state.errors, color: "" },
                }))
              }
            >
              <option>Select a color</option>
              {colors.map((color, i) => (
                <option key={i} value={color.hex}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>
          <div id="size">
            <h3 className="uppercase font-semibold mb-1">
              {!state.errors.size ? (
                "size"
              ) : (
                <span className="text-red-500">{state.errors.size}</span>
              )}
            </h3>
            <div className="flex flex-wrap gap-5 items-center uppercase">
              {product.sizes.map((size, i) => (
                <button
                  key={i}
                  className={` px-6 py-2 transition uppercase ${
                    state.size.info === size.info
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    setState((options) => ({
                      ...options,
                      size,
                      errors: { ...state.errors, size: "" },
                    }))
                  }
                >
                  {size.info}
                </button>
              ))}
            </div>
          </div>
          <div id="mount-type">
            <h3 className="uppercase font-semibold mb-1">
              {!state.errors.mountType ? (
                "mount type"
              ) : (
                <span className="text-red-500">{state.errors.mountType}</span>
              )}
            </h3>
            <div className="flex flex-wrap gap-5 items-center uppercase">
              {mountTypes.map((mountType, i) => (
                <button
                  key={i}
                  className={` px-6 py-2 transition capitalize ${
                    state.mountType === mountType
                      ? "bg-black text-white"
                      : "bg-gray-200 "
                  }`}
                  onClick={() =>
                    setState((options) => ({
                      ...options,
                      mountType,
                      errors: { ...state.errors, mountType: "" },
                    }))
                  }
                >
                  {mountType}
                </button>
              ))}
            </div>
          </div>
          <div id="quantity">
            <h3 className="uppercase font-semibold mb-1">
              {!state.errors.quantity ? (
                "quantity"
              ) : (
                <span className="text-red-500">{state.errors.quantity}</span>
              )}
            </h3>
            <div className="flex items-center gap-1">
              <button
                className="h-8 w-8 flex items-center justify-center bg-gray-200 transition hover:bg-black hover:text-white text-2xl"
                disabled={state.quantity <= 1}
                onClick={() =>
                  setState((state) => ({
                    ...state,
                    quantity: Number(state.quantity) - 1,
                  }))
                }
              >
                <BsDash />
              </button>
              <input
                type="number"
                min={1}
                value={state.quantity}
                onChange={(e) => {
                  if (e.target.value < 0) e.target.value = 1;
                  setState((state) => ({
                    ...state,
                    quantity: Number(e.target.value),
                  }));
                }}
                className="h-8 w-8 border border-gray-300 text-black hide-controls text-lg text-center"
              />
              <button
                className="h-8 w-8 flex items-center justify-center bg-gray-200 transition hover:bg-black hover:text-white text-2xl"
                onClick={() =>
                  setState((state) => ({
                    ...state,
                    quantity: Number(state.quantity) + 1,
                  }))
                }
              >
                <BsPlus />
              </button>
            </div>
          </div>
          <div className="">
            <QnA title="shipping">
              {product.shippingDescription ||
                "All of our neon signs are crafted from scratch just for you. If any changes are required for your design, such as custom colors, we will email you regarding the desired changes within 1-4 hours. Standard orders will generally arrive to your door in 10-15 days."}
            </QnA>
            <QnA title="faq">
              <div className="flex flex-col gap-4">
                <p className="font-semibold ">Are they hard to install?</p>{" "}
                <p>
                  Not at all! NeonSignCo signs come ready to hang, with
                  pre-drilled holes. If you can hang a picture frame, you can
                  hang a neon sign.
                </p>{" "}
                <p className="font-semibold ">How do Neon lights work?</p>
                <p>
                  Your neon will come with an adaptor suited to your delivery
                  location, and a remote control and dimmer. All you need to do
                  is plug it in to a power socket, just like a lamp. Then all
                  that's left to do is turn on and enjoy! Plus, you can adjust
                  your brightness with the remote control.
                </p>{" "}
                <p className="font-semibold">Quality and care.</p>
                <p>
                  We pride ourselves in exceptional quality, and happily offer
                  an extended 24 month manufacturers warranty (double the
                  industry standard!). Please note, pre-designed neons in our
                  shop are intended for indoor use only.
                </p>
                <p className="font-semibold ">
                  Looking for something more custom?
                </p>{" "}
                <p>All of our neon signs can be tailored to suit your style.</p>{" "}
                <p className="font-semibold ">Want a mix of fonts?</p>{" "}
                <p>If you can imagine it, we can create it.</p>{" "}
                <p className="font-semibold ">
                  Looking for a different color acrylic backing?
                </p>
                <p>
                  We offer transparent clear, solid black, high quality mirror,
                  as well as gold tinted mirror.
                </p>
                <p>For any questions please contact us!</p>
                <CustomLink
                  href={`mailto:${process.env.NEXT_PUBLIC_MAIL_ADDRESS}`}
                  text={process.env.NEXT_PUBLIC_MAIL_ADDRESS}
                  className="font-semibold hover:underline"
                />
              </div>
            </QnA>
          </div>

          <LoadingBtn
            loading={globalState.cartData.loading}
            className="px-12 text-lg py-3 bg-black text-white uppercase max-w-max"
            onClick={addToCart}
          >
            add to cart
          </LoadingBtn>

          <button
            className="p-2 border border-gray-500 max-w-max"
            onClick={() => {
              setShowForm((bool) => !bool);
              !showForm &&
                document
                  .getElementById("form-section")
                  .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Need something more custom?
          </button>
        </div>
      </div>
      <div className="">
        <div className="pt-20" id="form-section">
          {showForm && (
            <div className="mb-16">
              <h3 className="text-3xl text-center mb-5">
                Type your enquiry here
              </h3>
              <ContactForm
                productInfo={{
                  name: "produc 1",
                  link: window.location.href,
                  image: product.images?.[0]?.url,
                }}
              />
            </div>
          )}
        </div>
        <NewsLetterSection />
        <FollowSection />
      </div>
    </div>
  );
};

export default ProductPage;

const QnA = ({ title, children }) => {
  const [expand, setExpand] = useState(false);

  return (
    <div className=" w-full">
      <button
        className="w-full border-t border-b py-2 border-gray-400 flex items-center justify-between"
        onClick={() => setExpand((bool) => !bool)}
      >
        <h3 className="uppercase font-semibold">{title}</h3>
        <BsPlus
          className={`text-2xl transition ${expand ? "rotate-45" : ""}`}
        />
      </button>
      <AnimatePresence>
        {expand && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.3 },
            }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="py-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const getStaticProps = async ({ params }) => {
  try {
    await connectDb();
    const category = await Category.findOne({ slug: params.category }).lean();

    if (!category)
      return {
        notFound: true,
        revalidate: 10,
      };
    const product = await Product.findOne({
      slug: params.product,
      category: category._id,
    }).lean();

    if (!product)
      return {
        notFound: true,
        revalidate: 10,
      };
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
      revalidate: 10,
    };
  } catch (error) {
    return {
      props: {
        error: { code: 500, message: "server error" },
      },
      revalidate: 10,
    };
  }
};

export const getStaticPaths = async () => {
  try {
    const paths = [];
    await connectDb();
    const products = await Product.find()
      .populate({ path: "category", model: Category, select: "slug -_id" })
      .select("slug -_id")
      .lean();

    products.forEach((item) =>
      paths.push({
        params: { product: item.slug, category: item.category.slug },
      })
    );

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
};
