import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGlobalContext, ERROR } from '../context/GlobalContext';
import Axios from '../utils/Axios';


const ProductNavigation = ({ state, setState }) => {
  const [, setGlobalState] = useGlobalContext();
  const pagesCount = Math.ceil(state.numOfProducts / state.productsPerPage);

  const btns = [];
  for (let x = 1; x <= pagesCount; x++) btns.push(x);

  const navigate = async (page) => {
    try {
      const res = await Axios.get(
        `products?${state.category && `category=${state.category}`}${
          state.searchText && `&&name=${state.searchText}`
        }&&page=${page}&&limit=${state.productsPerPage}`
      );
      setState((state) => ({ ...state, page, products: res.data.products }));
      window.scroll({ top: 0 });
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
    <div className="flex justify-center gap-1 flex-wrap mt-10">
      <button
        className="bg-black h-10 w-10 flex items-center justify-center text-white disabled:bg-gray-500 disabled:cursor-text"
        disabled={state.page === 1}
        onClick={() => navigate(state.page - 1)}
      >
        <FaChevronLeft />
      </button>
      {btns.map((i) => (
        <button
          key={i}
          className="border border-black h-10 w-10 flex items-center justify-center bg-white transition hover:bg-black hover:text-white disabled:bg-black disabled:text-white disabled:cursor-text"
          disabled={state.page === i}
          onClick={() => navigate(i)}
        >
          {i}
        </button>
      ))}
      <button
        className="bg-black h-10 w-10 flex items-center justify-center text-white disabled:bg-gray-500 disabled:cursor-text"
        disabled={state.page * state.productsPerPage >= state.numOfProducts}
        onClick={() => navigate(state.page + 1)}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ProductNavigation;
