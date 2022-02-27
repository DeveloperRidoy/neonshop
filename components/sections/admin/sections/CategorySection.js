import { useState } from "react";
import { FaCheck, FaPencilAlt, FaTrash } from "react-icons/fa";
import { useAdminContext } from "../../../../pages/admin";
import Axios from "../../../../utils/Axios";
import LoadingBtn from "../../../LoadingBtn";
import {
  ERROR,
  SUCCESS,
  useGlobalContext,
} from "../../../../context/GlobalContext";

const CategorySection = () => {
  const [, setGlobalState] = useGlobalContext();
  const [adminState, setAdminState] = useAdminContext();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
      name: '', 
      description: ""
  });

  const addCategory = async (e) => {
    try {
        e.preventDefault();
        setLoading(true);
        const res = await Axios.post('categories', { name: state.name, description: state.description }); 
      setLoading(false) 
      setState(state => ({...state, name: '', description: ''}))
        setAdminState(state => ({ ...state, categories: [res.data.category, ...adminState.categories] }));
      setGlobalState((state) => ({
        ...state,
        alert: {
          ...state.alert,
          show: true,
          text: res.data.message,
          type: SUCCESS,
          timeout: 3000,
        },
      }));
    } catch (error) {
      setLoading(false);
      setGlobalState((state) => ({
        ...state,
        alert: {
          ...state.alert,
          show: true,
          text:
            error.response?.data?.message || error.message || "Network Error",
          type: ERROR,
          timeout: 3000,
        },
      }));
    }
  };

  const inputChange = (e) =>
    setState((state) => ({ ...state, [e.target.name]: e.target.value }));

  return (
    <div className="py-5 pr-2 md:p-10 w-full ">
      <form
        onSubmit={addCategory}
        className="grid gap-5 p-2 border bg-white w-full "
      >
        <div className="grid gap-2">
          <label htmlFor="name" className="capitalize font-semibold">
            category name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={state.name}
            onChange={inputChange}
            className="p-2 bg-gray-200"
            placeholder="name"
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="description" className="capitalize font-semibold">
            description
          </label>
          <textarea
            rows="3"
            id="description"
            name="description"
            placeholder="description"
            value={state.description}
            onChange={inputChange}
            className="p-2 bg-gray-200"
            required
          ></textarea>
        </div>

        <LoadingBtn
          loading={loading}
          className="py-2 px-5 bg-gray-800 text-white max-w-max capitalize"
        >
          add category
        </LoadingBtn>
      </form>
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-5">Categories</h2>
        <div className="grid gap-3">
          {adminState.categories &&
            adminState.categories.map((item) => (
              <CategoryItem key={item._id} item={item}/>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;

const CategoryItem = ({ item }) => {
     const [, setGlobalState] = useGlobalContext();
     const [adminState, setAdminState] = useAdminContext();
    const [state, setState] = useState({
        loaidng: false, 
        expand: false, 
        name: item.name, 
        description: item.description, 
        typed: false
  })

    const updateItem = async (e) => {
        try { 
            e.preventDefault();

            if (!state.typed) return setState(state => ({...state, expand: false}))
          setState(state => ({...state, loading: true}))
          const res = await Axios.patch(`categories/${item._id}`, {
            name: state.name,
            description: state.description,
          });
           setState((state) => ({ ...state, loading: false, expand:false, typed: false }));
          setAdminState((state) => ({
            ...state,
            categories: state.categories.map(i => i._id === item._id ? res.data.category: i),
          }));
          setGlobalState((state) => ({
            ...state,
            alert: {
              ...state.alert,
              show: true,
              text: res.data.message,
              type: SUCCESS,
              timeout: 3000,
            },
          }));
        } catch (error) {
          setState((state) => ({ ...state, loading: false }));
          setGlobalState((state) => ({
            ...state,
            alert: {
              ...state.alert,
              show: true,
              text:
                error.response?.data?.message ||
                error.message ||
                "Network Error",
              type: ERROR,
              timeout: 3000,
            },
          }));
        }
    }    
    
    const deleteItem = async (e) => {
      try {
        e.preventDefault();
        const yes = confirm("delete this category ?");
        if (!yes) return;
        await Axios.delete(`categories/${item._id}`, {
          name: state.name,
          description: state.description,
        });
        setAdminState((state) => ({
          ...state,
          categories: adminState.categories.filter(i => i._id !== item._id),
        }));
      } catch (error) {
        setGlobalState((state) => ({
          ...state,
          alert: {
            ...state.alert,
            show: true,
            text:
              error.response?.data?.message || error.message || "Network Error",
            type: ERROR,
            timeout: 3000,
          },
        }));
      }
    };    

  return (
    <form className="grid gap-2 p-2 bg-white border border-gray-300" onSubmit={updateItem}>
      <div className="flex gap-2 items-center">
        <p className="font-semibold capitalize">name:</p>
        {state.expand ? (
          <input
            type="text"
            value={state.name}
            onChange={(e) =>
              setState((state) => ({ ...state, name: e.target.value, typed: true }))
            }
            className="p-2 bg-gray-200 w-full"
            required
          />
        ) : (
          <p>{state.name}</p>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <p className="font-semibold capitalize">description:</p>
        {state.expand ? (
          <textarea
            className="p-2 bg-gray-200"
            value={state.description}
            onChange={(e) =>
              setState((state) => ({ ...state, description: e.target.value, typed: true }))
            }
            className="p-2 bg-gray-200 w-full"
            required
          />
        ) : (
          <p>{state.description}</p>
        )}
      </div>
      <div className="flex justify-end gap-3">
        {state.expand ? (
          <button 
            type="button"
            className="p-2 bg-gray-200 transition hover:bg-gray-400"
            onClick={updateItem}
          >
            <FaCheck />
          </button>
        ) : (
          <button
            type="button"
            className="p-2 bg-gray-200 transition hover:bg-gray-400"
            onClick={() =>
              setState((state) => ({ ...state, expand: !state.expand }))
            }
          >
            <FaPencilAlt />
          </button>
        )}
        <button
          type="button"
          className="p-2 bg-gray-300 transition hover:bg-gray-400" 
          onClick={deleteItem}
        >
          <FaTrash />
        </button>
      </div>
    </form>
  );
};
