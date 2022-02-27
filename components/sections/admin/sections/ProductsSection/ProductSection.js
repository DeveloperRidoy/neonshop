import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPencilAlt, FaTrash } from "react-icons/fa";
import { ERROR, SUCCESS, useGlobalContext } from "../../../../../context/GlobalContext";
import { useAdminContext } from "../../../../../pages/admin";
import Axios from "../../../../../utils/Axios";
import catchASync from "../../../../../utils/catchASync";
import LoadingBtn from "../../../../LoadingBtn";
import AddNewProductSection from "../AddNewProductSection";
import SearchBar from "./SearchBar";


const ProductSection = () => {
  const [, setGlobalState] = useGlobalContext();  
  const [adminState, setAdminState] = useAdminContext();

  const [state, setState] = useState({
    page: 1, 
    productsPerPage: 30,
      category: '',
      selectedProductIds: [],   
      activeProduct: '', 
      searchText: '',
      loading: false
    });

  const deleteProducts = () => catchASync(
    async () => {
      const yes = confirm("Delete these products ?");
      if (!yes) return;
      setState((state) => ({ ...state, loading: true }));
      await Axios.put("products/specific", { ids: state.selectedProductIds });
      setAdminState((adminState) => ({
        ...adminState,
        products: adminState.products.filter(
          (item) => !state.selectedProductIds.includes(item._id)
        ),
      }));
      setState((state) => ({
        ...state,
        loading: false,
      }));
      setGlobalState(state => ({ ...state, alert: { ...state.alert, show: true, type: SUCCESS, text: 'products deleted', timeout: 3000 } }));

    },
    setGlobalState,
    () => setState((state) => ({ ...state, loading: false }))
  );
    


    return (
      <div className="py-5 md:p-10 w-full">
        {!state.activeProduct && (
          <SearchBar state={state} setState={setState} />
        )}
        {!state.activeProduct ? (
          <div className="">
            {" "}
            <div className="hidden md:block mt-5">
              {state.selectedProductIds.length > 0 && (
                <div className="p-2 pr-12 bg-white border flex justify-between">
                  <p>delete these products?</p>
                  <LoadingBtn
                    loading={state.loading}
                    className="bg-red-500 text-white py-1 px-2"
                    onClick={deleteProducts}
                  >
                    delete
                  </LoadingBtn>
                </div>
              )}
              <table className="w-full bg-white">
                <thead className="h-12 border-b border-gray-200">
                  <tr className="border border-gray-200">
                    <th className="text-left pl-2">
                      <input
                        type="checkbox"
                        checked={
                          state.selectedProductIds.length > 0 &&
                          state.selectedProductIds.length ===
                            adminState.products?.length
                        }
                        onChange={(e) =>
                          setState((state) => ({
                            ...state,
                            selectedProductIds: !e.target.checked
                              ? []
                              : adminState.products.map(
                                  (product) => product._id
                                ),
                          }))
                        }
                      />
                    </th>
                    <th className="text-left">Image</th>
                    <th className="text-left">Name</th>
                    <th className="text-left">Description</th>
                    <th className="text-left">Price(lowest)</th>
                  </tr>
                </thead>
                <tbody>
                  {adminState.products?.map((product) => (
                    <TableItem
                      key={product._id}
                      product={product}
                      state={state}
                      setState={setState}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden grid gap-3 text-black mt-5">
              {adminState.products?.map((product) => (
                <Item
                  key={product._id}
                  product={product}
                  state={state}
                  setState={setState}
                />
              ))}
            </div>
            <div className="flex p-2 items-center">
              <ProductNavigation
                state={state}
                setState={setState}
              />
            </div>
          </div>
        ) : (
          <AddNewProductSection
            product={state.activeProduct}
            setOrdersSection={setState}
            edit={true}
            className="mt-5 md:p-0 "
          />
        )}
      </div>
    );
}

export default ProductSection

const TableItem = ({ product, state, setState }) => { 
  const [, setGlobalState] = useGlobalContext();
  const [adminState, setAdminState] = useAdminContext();
  const checked = state.selectedProductIds.includes(product._id);

  const [loading, setLoading] = useState(false); 


  const deleteProduct = () => catchASync(async () => {
    const yes = confirm('delete this product ?'); 
    if (!yes) return;
    setLoading(true);
    await Axios.delete(`products/${product._id}`);
    setLoading(false);
    setAdminState((state) => ({
      ...state,
      products: adminState.products.filter((item) => item._id !== product._id),
    })); 
    setState((state) => ({
      ...state,
      products: adminState.products.filter((item) => item._id !== product._id),
    })); 
  }, setGlobalState, setLoading(false))

  const toggleCheck = () => {
    setState((state) => ({
      ...state,
      selectedProductIds: checked
        ? state.selectedProductIds?.filter((id) => id !== product._id)
        : [...state.selectedProductIds, product._id],
    }));
  }

  return (
    <tr className="border border-gray-300">
      <td className="pl-2 p-2">
        <input type="checkbox" checked={checked} onChange={toggleCheck} />
      </td>
      <td>
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="h-20 w-32 w-full object-cover"
        />
      </td>
      <td>{product.name}</td>
      <td>{product.description}</td>
      <td className="font-semibold">${product.sizes[0].price}</td>
      <td>
        <button
          className=" rounded-full h-10 w-10 flex items-center justify-center transition active:bg-gray-200 text-purple-600"
          onClick={() =>
            setState((state) => ({ ...state, activeProduct: product }))
          }
        >
          <FaPencilAlt />
        </button>
      </td>
      <td>
        <LoadingBtn
          loading={loading}
          className=" rounded-full h-10 w-10 flex items-center justify-center transition active:bg-gray-200 text-red-500 " 
          borderColor="border-red-500"
          onClick={deleteProduct}
        >
          {!loading && <FaTrash />}
        </LoadingBtn>
      </td>
    </tr>
  );
};

const Item = ({ product, setState }) => {
  const [, setGlobalState] = useGlobalContext();
  const [adminState, setAdminState] = useAdminContext();

  const [loading, setLoading] = useState(false); 
  const deleteProduct = () =>
    catchASync(
      async () => {
        const yes = confirm("delete this product ?");
        if (!yes) return;
        setLoading(true);
        await Axios.delete(`products/${product._id}`);
        setLoading(false);
        setAdminState((state) => ({
          ...state,
          products: adminState.products.filter(
            (item) => item._id !== product._id
          ),
        }));
        setState((state) => ({
          ...state,
          products: adminState.products.filter(
            (item) => item._id !== product._id
          ),
        }));
      },
      setGlobalState,
      setLoading(false)
    );

  return (
    <div className="p-2 bg-white border border-gray-300 shadow flex gap-2">
      <img
        src={product.images?.[0]?.url}
        alt={product.name}
        className="object-cover w-32"
      />
      <div className="grid gap-2 w-full">
        <p>
          <span className="font-semibold capitalize">name:</span> {product.name}
        </p>
        <p>
          <span className="font-semibold capitalize">description:</span>{" "}
          {product.description}
        </p>
        <p>
          <span className="font-semibold capitalize">price:</span>{" "}
          {product.sizes[0].price}
        </p>
        <div className="flex justify-end">
          <button
            className="h-10 w-10 flex justify-center items-center rounded-full active:bg-gray-200 transition  text-purple-700"
            onClick={() =>
              setState((state) => ({ ...state, activeProduct: product }))
            }
          >
            <FaPencilAlt />
          </button>
          <LoadingBtn
            borderColor="border-red-500"
            loading={loading}
            className="h-10 w-10 flex justify-center items-center rounded-full active:bg-gray-200 transition  text-red-500"
            onClick={deleteProduct}
          >
            {!loading && <FaTrash />}
          </LoadingBtn>
        </div>
      </div>
    </div>
  );
};






const ProductNavigation = ({state, setState}) => {
  const [, setGlobalState] = useGlobalContext();
  const [adminState, setAdminState] = useAdminContext();
  const pagesCount = Math.ceil(adminState.numOfProducts / state.productsPerPage);

  const btns = [];
  for (let x = 1; x <= pagesCount; x++) btns.push(x);

  const navigate = async (page) => {
    try {
      const res = await Axios.get(
        `products?${state.category && `category=${state.category}`}${
          state.searchText && `&&name=${state.searchText}`
        }&&page=${page}&&limit=${state.productsPerPage}`
      );
      setState((state) => ({ ...state, page, }));
      setAdminState((state) => ({ ...state,  products: res.data.products }));
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
        disabled={state.page * state.productsPerPage >= adminState.numOfProducts}
        onClick={() => navigate(state.page + 1)}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}