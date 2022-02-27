import { useAdminContext } from "../../../../../pages/admin";
import { FaSearch } from "react-icons/fa";
import { ERROR, useGlobalContext } from "../../../../../context/GlobalContext";
import Axios from "../../../../../utils/Axios";
import { useEffect, useState } from "react";
import LoadingBtn from "../../../../LoadingBtn";




const SearchBar = ({state, setState}) => {
  const [adminState, setAdminState] = useAdminContext();
  const [, setGlobalState] = useGlobalContext();
    const changeCategory = async (e) => {
      try {
        const res = await Axios.get(
          `products?category=${e.target.value}&&name=${state.searchText}&&limit=${state.productsPerPage}`
        );
        setState((state) => ({
          ...state,
          category: e.target.value,
        }));
        setAdminState(state => ({...state, products: res.data.products}))
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
    
  return (
    <div className="flex flex-col gap-3">
      <ProductSearch state={state} setState={setState} />
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="capitalize">category</p>
          <select
            className="bg-gray-100 p-2 bg-white border"
            defaultValue={state.category}
            onChange={(e) => changeCategory(e)}
          >
            <option value="">All</option>
            {adminState.categories.map((item) => (
              <option value={item._id} key={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};


export default SearchBar;




const ProductSearch = ({ state, setState }) => {
  const [, setGlobalState] = useGlobalContext();
  const [, setAdminState] = useAdminContext();
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
      setState((state) => ({ ...state, page: 1 }));
      setAdminState((state) => ({
        ...state,
        products: res.data.products,
      }));
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
    const debounce = setTimeout(search, 800);
    return () => clearTimeout(debounce);
  }, [state.searchText]);

  return (
    <div className="flex items-center " >
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
    </div>
  );
};
