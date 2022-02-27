import { useEffect, useRef, useState } from "react"
import { BsSearch, BsX } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import CatchAsync from '../utils/catchASync';
import { useGlobalContext } from '../context/GlobalContext'
import {Loader} from './LoadingBtn'
import Axios from "../utils/Axios";
import CustomLink from "./CustomLink";

const SearchBar = ({ containerRef }) => {
  const ref = useRef();
  const [expand, setExpand] = useState(false);
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false); 
  const [, setGlobalState] = useGlobalContext();
  const [results, setResults] = useState([]);
  // focus input on expanding searchBar
  useEffect(() => {
    expand && ref.current.focus();
    return () => {};
  }, [expand]);

  useEffect(() => {
    // only close searchbar if clicked outside
    const listener = (e) => {
      e.target !== containerRef.current &&
        !containerRef.current.contains(e.target) &&
        setExpand(false);
    };
    window.addEventListener("mousedown", listener);

    return () => window.removeEventListener("mousedown", listener);
  }, []);

  useEffect(() => {
    const listener = (e) => e.key === "Escape" && setExpand(false);

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);



  useEffect(() => {
    if (!text) return setResults([]);
    const debounce = setTimeout(search, 1000);
    return () => clearTimeout(debounce);
  }, [text])


  const search = () => CatchAsync(async () => {
    setLoading(true);
    const res = await Axios.get(`products?name=${text}`);
    setResults(res.data.products);
    setLoading(false)
  }, setGlobalState, () => setLoading(false))

  return (
    <div className="md:relative">
      <button
        className="mt-2.5 text-lg"
        onClick={() => setExpand((bool) => !bool)}
      >
        <BsSearch />
      </button>
      <AnimatePresence>
        {expand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            className="absolute left-0 md:left-auto right-0 top-0 md:right-0 md:w-72 bg-black min-w-max  grid gap-0 p-2 md:p-0"
          >
            <div className="relative">
              <input
                ref={ref}
                type="text"
                placeholder="Search here..."
                className="pl-2 pr-5 py-1 right-0 top-0 outline-none text-black w-full bg-white border-b border-gray-500 text-lg"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <button
                className="absolute right-0 text-black top-[px] transition hover:scale-125 p-2"
                onClick={() => setExpand((bool) => !bool)}
              >
                <BsX />
              </button>
            </div>
            <div className="bg-black z-10 w-full">
              {loading ? (
                <div className="max-w-max mx-auto p-2 bg-black">
                  <Loader />
                </div>
              ) : (
                results.length > 0 && (
                  <div className="grid gap-2 p-4 max-h-[calc(100vh-70px)] overflow-auto bg-black">
                    {results.map((item) => (
                      <CustomLink
                        href={`/shop/${item.category.slug}/${item.slug}`}
                        className="flex gap-2 transition hover:bg-gray-900 p-2"
                        key={item._id}
                        onClick={() => setExpand(false)}
                      >
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="h-10"
                        />
                        <p>{item.name}</p>
                      </CustomLink>
                    ))}
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar
