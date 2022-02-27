import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useGlobalContext } from "../../context/GlobalContext";
import CustomLink from "../CustomLink";
import { Loader } from "../LoadingBtn";

const DropDown = ({ title, containerRef }) => {
  const [expand, setExpand] = useState(false);
  const [globalState] = useGlobalContext();
  const items = [
    {
      title: "explore",
      links: [
        { link: "/custom-neon-sign", text: "build your own" },
        { link: "/shop", text: "shop all" },
      ],
    },
    {
      title: "categories",
      links: globalState.categoryData.categories?.map(item => ({link: `shop/${item.slug}`, text: item.name}))
    },
  ];



    useEffect(() => {
        // only close dropdown if clicked outside
      const listener = e => {
        e.target !== containerRef.current && !containerRef.current.contains(e.target) && setExpand(false)
      };
        window.addEventListener('mousedown', listener);
        
        return () => window.removeEventListener('mousedown', listener);
    }, [])
    
  return (
    <div className="relative">
      <button
        className="flex gap-1 capitalize"
        onClick={() => setExpand((bool) => !bool)}
      >
        <span>{title}</span>
        <FaCaretDown
          className={`mt-[7px] text-sm transition-all transform ${
            expand ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {expand && (
        <div className={`absolute w-full -bottom-3 transition-all`}>
          <motion.div
            initial={{ padding: 0, opacity: 0 }}
            animate={{
              padding: "2rem",
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            className={`flex gap-20 absolute left-1/2 -translate-x-1/2 bg-gray-900 overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {globalState.categoryData.loading  ? <Loader/>: items.map((item, i) => (
              <div key={i} className="">
                <h3 className="font-semibold mb-3 uppercase">{item.title}</h3>
                <div className="grid gap-1">
                  {item.links?.map((link, i) => (
                    <CustomLink
                      key={i}
                      text={link.text}
                      href={link.link || "/shop/category-1"}
                      className="text-base whitespace-nowrap transition hover:underline "
                      onClick={() => setExpand(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};


export default DropDown;
