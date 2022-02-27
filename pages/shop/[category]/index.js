import { useEffect, useState } from "react";
import {
  FaSearch,
  FaStar,
} from "react-icons/fa";
import BreadCrumb from "../../../components/BreadCrumb";
import CustomLink from "../../../components/CustomLink";
import FollowSection from "../../../components/sections/FollowSection";
import NewsLetterSection from "../../../components/sections/NewsLetterSection";
import connectDb from "../../../server/utils/connectDb";
import Category from '../../../server/models/category'; 
import Product from '../../../server/models/product'; 
import { ERROR, useGlobalContext } from "../../../context/GlobalContext";
import LoadingBtn, { Loader } from "../../../components/LoadingBtn";
import Axios from "../../../utils/Axios";
import { useRouter } from "next/router";
import Head from 'next/head';

// variables 
const LTH = 'LTH'; 
const HTL = 'HTL'; 
const ATZ = 'ATZ'; 
const ZTA = 'ZAT'
const NTO = 'NTO';
const OTN = 'OTN';

const CategoryPage = ({category, products}) => {

  const [state, setState] = useState({
    category: '', 
    sort: NTO,
    searchText: '',
    products, 
    category
  });


  const sortItems = (e) => {
    const val = e.target.value;
    setState((state) => ({
      ...state,
      sort: val,
      products: state.products.sort((a, b) =>
        val === OTN
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : val === NTO
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : val === HTL
          ? b.sizes[0].price - a.sizes[0].price
          : val === LTH
          ? a.sizes[0].price - b.sizes[0].price
          : val === ATZ
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      ),
    }));
  };


  if(useRouter().isFallback) return (
    <div className="h-screen grid place-content-center">
      <Loader borderColor="border-black"/>
    </div>
  );

  return (
    <div>
      <Head>
        <title>{category.name} | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="px-5 lg:px-20 py-20 bg-black text-white flex flex-col gap-5 items-center text-center "
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0,0.9), rgba(0, 0, 0,0.9)), url('/img/neon-banner-5.jpg')",
        }}
      >
        <h3 className="text-3xl md:text-5xl font-semibold uppercase">
          {category.name}
        </h3>
        <p>{category.description}</p>
      </div>
      <div className=" py-10 bg-gray-100">
        <div className="px-5 lg:px-20">
          <div className=" mb-5">
            <BreadCrumb />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 md:flex-row justify-between">
              <div className="flex items-center gap-1">
                <p>Sort by</p>
                <select
                  className="capitalize p-1 border border-gray-300"
                  value={state.sort}
                  onChange={(e) => sortItems(e)}
                >
                  <option value={LTH}>price: low to high</option>
                  <option value={HTL}>price: high to low</option>
                  <option value={ATZ}>A-Z</option>
                  <option value={ZTA}>Z-A</option>
                  <option value={OTN}>oldenst to newest</option>
                  <option value={NTO}>newest to oldest</option>
                </select>
              </div>
            </div>
            <ProductSearch state={state} setState={setState} />
          </div>
        </div>
        <div className="px-5 lg:px-20 grid grid-cols-2 md:grid-cols-3  gap-x-12 gap-y-16 bg-white mt-4">
          {state.products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      </div>
      <NewsLetterSection />
      <FollowSection />
    </div>
  );
};

export default CategoryPage;

const ProductItem = ({ product }) => {

  return (
    <CustomLink
      href={`/shop/${useRouter().query.category}/${product.slug}`}
      className="grid gap-1"
    >
      <div className="relative">
        {product.salePercentage > 0 && (
          <div className="absolute bg-red-500 py-1 px-2 text-white text-sm">
            -{product.salePercentage}%
          </div>
        )}
        <img src={product.images?.[0]?.url} alt={product.name} />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold uppercase">
        {product.name}
      </h3>
      {product.reviews?.length > 0 && (
        <div className="flex flex-col sm:flex-row  gap-1">
          <div className="flex flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar
                key={i}
                className={i > i ? "text-gray-400" : "text-black"}
              />
            ))}
          </div>
          <div>| 10 Reviews</div>
        </div>
      )}
      <p className="">${product.sizes[0].price}</p>
    </CustomLink>
  );
};




const ProductSearch = ({ state, setState }) => {
  const [, setGlobalState] = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState(false);
  const search = async () => {
    try {
      if (!typed) return;
      setLoading(true);
      const res = await Axios.get(
        `products?name=${state.searchText}&&category=${state.category._id}`
      );
      
      setState((state) => ({ ...state, products: res.data.products }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setGlobalState((state) => ({
        ...state,
        alert: {
          show: true,
          type: ERROR,
          text:
            error.response?.data?.message || error.message || "Network Error",
        },
      }));
    }
  };

  useEffect(() => {
    const debounce = setTimeout(search, 1000);
    return () => clearTimeout(debounce);
  }, [state.searchText]);

  return (
    <form className="flex items-center ">
      <input
        type="text"
        className="p-2 border border-gray-300 h-full w-full"
        placeholder="Search Product  "
        vaue={state.searchText}
        onChange={(e) => {
          setState((state) => ({ ...state, searchText: e.target.value }));
          setTyped(true);
        }}
        required
      />
      <LoadingBtn
        loading={loading}
        className="bg-black py-3 px-4 text-white h-full"
      >
        {!loading && <FaSearch />}
      </LoadingBtn>
    </form>
  );
};





export const getStaticProps = async ({ params }) => { 
  try {
    await connectDb();
    const category = await Category.findOne({ slug: params.category }).lean(); 

    if (!category) return {
      notFound: true, 
      revalidate: 10
    }

    const products = await Product.find({ category: category._id}).lean(); 
    return {
      props: {
        category: JSON.parse(JSON.stringify(category)),
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





export const getStaticPaths = async () => {
  try {
    const paths = [];
    await connectDb();
    const categories = await Category.find().select('slug -_id').lean();
    categories.forEach((item) => paths.push({ params: { category: item.slug } }));
  
    return {
      paths,
      fallback: true, 
    };
  } catch (error) {
    return {
      paths: [], 
      fallback: false
    }; 
  }
};