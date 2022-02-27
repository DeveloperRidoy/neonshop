import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import BreadCrumb from "../../components/BreadCrumb";
import CustomLink from "../../components/CustomLink";
import FollowSection from "../../components/sections/FollowSection";
import NewsLetterSection from "../../components/sections/NewsLetterSection";
import Category from "../../server/models/category";
import Product from "../../server/models/product";
import Axios from "../../utils/Axios";
import { ERROR, useGlobalContext } from "../../context/GlobalContext";
import LoadingBtn from "../../components/LoadingBtn";
import connectDb from "../../server/utils/connectDb";
import ProductNavigation from "../../components/ProductNavigation";
import Head from "next/head";

// variables
const LTH = "LTH";
const HTL = "HTL";
const ATZ = "ATZ";
const ZTA = "ZAT";
const NTO = "NTO";
const OTN = "OTN";
const productsPerPage = 30;

const Shop = ({ categories, products, numOfProducts }) => {
  const [, setGlobalState] = useGlobalContext();
  const [state, setState] = useState({
    page: 1,
    productsPerPage,
    categories,
    category: "",
    products,
    sort: NTO,
    searchText: "",
    numOfProducts,
  });

  const changeCategory = async (e) => {
    try {
      const res = await Axios.get(
        `products?category=${e.target.value}&&name=${state.searchText}&&limit=${state.productsPerPage}`
      );
      console.log(res.data);
      // setLoading(false)
      setState((state) => ({
        ...state,
        category: e.target.value,
        products: res.data.products,
      }));
    } catch (error) {
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
  return (
    <div>
      <Head>
        <title>Shop | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" py-10 bg-gray-100">
        <div className="px-5 lg:px-20">
          <h1 className="text-3xl lg:text-4xl max-w-max mx-auto uppercase">
            Products
          </h1>
          <div className=" mb-5">
            <BreadCrumb />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 md:flex-row justify-between">
              <div className="flex items-center gap-2">
                <p>Shop by category</p>
                <select
                  className="capitalize p-1 border border-gray-300"
                  defaultValue={state.category}
                  onChange={(e) => changeCategory(e)}
                >
                  <option value="">all</option>
                  {state.categories.map((item) => (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
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
        <ProductNavigation state={state} setState={setState} />
      </div>
      <NewsLetterSection />
      <FollowSection />
    </div>
  );
};

export default Shop;

const ProductSearch = ({ state, setState }) => {
  const [, setGlobalState] = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState(false);
  const search = async () => {
    try {
      if (!typed) return;
      setLoading(true);
      const res = await Axios.get(
        `products?name=${state.searchText}&&page=${1}&&limit=${
          state.productsPerPage
        }&&category=${state.category}`
      );
      setState((state) => ({ ...state, products: res.data.products, page: 1 }));
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

const ProductItem = ({ product }) => {
  return (
    <CustomLink
      href={`/shop/${product.category.slug}/${product.slug}`}
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
      <p className="">${product.sizes[0].price}</p>
    </CustomLink>
  );
};

export const getStaticProps = async () => {
  try {
    await connectDb();

    const categories = await Category.find().lean();
    const products = await Product.find()
      .populate({ path: "category", model: Category, select: "slug -_id" })
      .sort({ createdAt: -1 })
      .limit(productsPerPage)
      .lean();
    const numOfProducts = await Product.countDocuments().lean();

    return {
      props: {
        categories: JSON.parse(JSON.stringify(categories)),
        products: JSON.parse(JSON.stringify(products)),
        numOfProducts,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: { code: 500, message: "server error" },
      },
      revalidate: 10,
    };
  }
};
