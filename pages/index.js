import Head from "next/head";
import {
  FaBrush,
  FaClock,
  FaCogs,
  FaDesktop,
  FaFileSignature,
  FaHandHoldingHeart,
  FaHands,
  FaRibbon,
  FaShippingFast,
} from "react-icons/fa";
import CustomLink from "../components/CustomLink";
import ProductsSlider from "../components/sliders/ProductsSlider";
import NewsLetterSection from "../components/sections/NewsLetterSection";
import connectDb from "../server/utils/connectDb";
import Product from "../server/models/product";
import Category from "../server/models/category";
import FollowSection from "../components/sections/FollowSection";

export default function Home({ products }) {
  return (
    <div className="">
      <Head>
        <title>NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className=" pt-5  relative text-white  bg-black">
        <img
          src="img/neon-banner-mobile.png"
          alt="neonsignco banner"
          className=" object-cover  filter md:brightness-[.9] md:hidden "
        />
        <img
          src="img/neon-banner.png"
          alt="neonsignco banner"
          className=" object-cover  filter md:brightness-[.9] hidden md:block "
        />
        <div className="mx-auto max-w-max py-10 flex flex-col sm:flex-row gap-10 uppercase whitespace-nowrap font-semibold ">
          <CustomLink
            href="/shop"
            text="shop"
            className="h-12 w-52 flex items-center justify-center bg-gray-900"
          />
          <CustomLink
            href="/custom-neon-sign"
            text="design your neon"
            className="h-12 w-52 flex items-center justify-center bg-white text-black filter "
          />
        </div>
      </section>
      <section className="px-5 lg:px-20 py-20 bg-white text-black ">
        <h3 className="text-3xl uppercase font-semibold uppercase mb-20 text-center">
          our neon process
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-16">
          <div className="bg-black text-white p-4 grid gap-3 uppercase">
            <FaDesktop className="text-3xl" />
            <p className="text-2xl">design</p>
            <p className="text">design and order your neon sign</p>
          </div>
          <div className="bg-black text-white p-4 grid gap-3 uppercase">
            <FaBrush className="text-3xl" />
            <p className="text-2xl">create</p>
            <p className="text">
              WE CREATE YOUR NEON SIGN USING PREMIUM MATERIAL
            </p>
          </div>
          <div className="bg-black text-white p-4 grid gap-3 uppercase">
            <FaShippingFast className="text-3xl" />
            <p className="text-2xl">ship</p>
            <p className="text">WE SHIP YOUR NEON CREATION TO YOUR HOUSE</p>
          </div>
          <div className="bg-black text-white p-4 grid gap-3 uppercase">
            <FaHandHoldingHeart className="text-3xl" />
            <p className="text-3xl">enjoy</p>
            <p className="text">YOU BASK IN YOUR NEW NEON GLOW</p>
          </div>
        </div>
      </section>
      <section
        className="px-5 lg:px-20 py-10 flex flex-col lg:flex-row items-center justify-between gap-10 bg-black text-white relative text-center md:text-left"
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0,0.94), rgba(0, 0, 0,0.94)), url('/img/neon-banner-3.jpg')",
        }}
      >
        <div className="flex-1 grid gap-5 justify-items-center md:justify-items-start">
          <h3 className="text-3xl uppercase font-semibold uppercase">
            DESIGN A CUSTOM LED NEON SIGN
          </h3>
          <p className="font-semibold text-lg">
            Customize your very own neon sign
          </p>
          <CustomLink
            href="/custom-neon-sign"
            text="customize"
            className="h-12 w-52 flex items-center justify-center bg-white uppercase text-black font-semibold mt-10"
          />
        </div>
        <div>
          <img src="/img/neon-banner-4.png" alt="" />
        </div>
      </section>
      <section className="px-5 lg:px-20 py-20 bg-white">
        <h3 className="text-3xl uppercase font-semibold uppercase text-center mb-10">
          our best-selling products
        </h3>
        {products?.length > 0 && (
          <ProductsSlider
            products={products}
          />
        )}
      </section>
      <section
        className="px-5 lg:px-20 py-20 bg-black"
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0,0.9), rgba(0, 0, 0,0.9)), url('/img/neon-banner-2.jpg')",
          backgroundAttachment: "fixed",
        }}
      >
        <h3 className="text-3xl uppercase font-semibold uppercase text-center mb-20 text-white">
          Why choose us?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-24">
          <Item
            title="free shipping"
            text="We’ve got your back. From our door to yours, we ship Neons to all the corners of the globe - for FREE! It doesn’t matter where you are, we’ll get it to you using the most reliable couriers available."
          >
            <FaShippingFast className="text-blue-500" />
          </Item>
          <Item
            title="24 month warranty"
            text="Don’t stress, we’re here for you. We provide a 24-month manufacturer warranty, double the industry standard, on any neon signs that have been used indoors."
          >
            <FaRibbon className="text-yellow-500" />
          </Item>
          <Item
            title="best value"
            text="We believe we have the best value Neons in the world – and 1000s of our awesome clients agree. Have a quote for a cheaper price? Let us know. We’ll match it and give you a virtual high-five!"
          >
            <FaFileSignature className="text-green-500" />
          </Item>
          <Item
            title="100% ON TIME GUARANTEE"
            text="Let us know your event date as soon as you've purchased. In the unlikely chance your sign delivery misses the event date and we've agreed that we can deliver, we'll give you 100% money back - and you get to keep the neon! Full T & C's here."
          >
            <FaClock className="text-pink-500" />
          </Item>
          <Item
            title="EASY INSTALLATION"
            text="They go up like a picture frame and plug in like a lamp! Every NeonSignCo Neon comes with an installation kit and pre-drilled holes, ready to hang and enjoy right out of the box. Find out more about how to hang your Neon here."
          >
            <FaCogs className="text-green-500" />
          </Item>
          <Item
            title="HAND-MADE"
            text="We make Neons to order. Whether it’s your custom creation, or one of our pre-designed items, each piece is handmade by a specialist Neon artisan, especially for you."
          >
            <FaHands className="text-indigo-500" />
          </Item>
        </div>
      </section>
      <div className="mt-32">
        <NewsLetterSection />
      </div>
      <FollowSection />
    </div>
  );
}

const Item = ({ title, text, children }) => {
  return (
    <div className="flex-1 flex flex-col gap-5 items-center p-2 border-2 hover-animation bg-white">
      <div className="h-24 w-24 bg-gray-900 rounded-full flex items-center justify-center text-5xl">
        {children}
      </div>
      <p className="uppercase font-semibold text-lg ">{title}</p>
      <p className="text-sm text-center">{text}</p>
    </div>
  );
};

export const getStaticProps = async () => {
  try {
    await connectDb();

    const products = await Product.find()
      .populate({ path: "category", model: Category, select: "slug -_id" })
      .sort({ createdAt: -1 })
      .limit(9)
      .lean();

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
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
