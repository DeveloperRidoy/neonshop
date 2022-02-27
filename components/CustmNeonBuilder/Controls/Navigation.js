import { FaAngleDoubleRight, FaChevronRight } from "react-icons/fa";
import { BsX } from "react-icons/bs";
import { useNeonBuilderContext } from "../../../context/NeonBuilderContext";
import { motion } from "framer-motion";
import CustomLink from "../../CustomLink";

const Navigation = () => {
  const [state, setState] = useNeonBuilderContext();

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0, transition: { duration: 0.2 } }}
      exit={{ y: "100%", transition: { duration: 0.2 } }}
      className="absolute inset-0 bg-white flex flex-col overflow-auto z-10"
    >
      <button
        className="flex gap-2 items-center px-3 py-2 border-b capitalize text-lg transition hover:bg-gray-200"
        onClick={() =>
          setState((state) => ({
            ...state,
            controls: { ...state.controls, showNavigation: false },
          }))
        }
      >
        <BsX /> <span>all steps</span>
      </button>
      <Item title="Neon Text" text={state.data.text} number="1" target="text" />

      <Item
        title="Neon Font"
        text={state.data.font.text}
        number="2"
        target="font"
      />

      <Item
        title="Neon Color"
        text={state.data.color.name}
        number="3"
        target="color"
      />

      <Item
        title="Neon Icon"
        text={state.data.icon.name}
        number="4"
        target="icon"
      />
      
      <Item title="Neon Size" text={state.data.size.name} number="5" target="size" />
      
      <Item
        title="Neon backing color"
        text={
          state.data.backing.backingColor
        }
        number="6"
        target="backing-color"
      />
      <Item
        title="Neon backing type"
        text={
          state.data.backing.backingType
        }
        number="7"
        target="backing-type"
      />
      <Item
        title="Moun type"
        text={state.data.mountType}
        number="8"
        target="mount-type"
      />
      <Item
        title="Note"
        text={state.data.note}
        number="9"
        target="note"
      />
      <CustomLink
        target="_blank"
        href="/contact"
        text="Got a logo? send us your details"
        className="font-semibold text-center py-5"
      />
    </motion.div>
  );
};

export default Navigation;

const Item = ({ title, text, number, target }) => {
  const [, setState] = useNeonBuilderContext();
  return (
    <button
      className="flex justify-between items-center px-3 border-b py-2 transition hover:bg-gray-200"
      onClick={() => {
        setState((state) => ({
          ...state,
          controls: { ...state.controls, showNavigation: false },
        }));
        document.getElementById(target).scrollIntoView({ behavior: "smooth" });
      }}
    >
      <div className="flex items-center gap-2 capitalize">
        <div className="text-xl font-light">{number}</div>
        <div className=" text-left">
          <p className="font-semibold" style={{textOverflow: 'ellipsis', overflow: "hidden"}}>{title}</p>
          <p className="text-sm">{text}</p>
        </div>
      </div>
      <FaChevronRight/>
    </button>
  );
};
