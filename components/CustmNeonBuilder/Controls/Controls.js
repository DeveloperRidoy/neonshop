import CustomLink from "../../CustomLink";
import { FaCartArrowDown } from "react-icons/fa";
import { calcPrice, calcWidth, colors, fonts, icons, sizes } from "../../../utils/CustomNeonAssets";
import Navigation from "./Navigation";
import { BLACKACRYLIC, CLEARACRYLIC, CUT_TO_SHAPE, GOLDMIRRORACRYLIC, MIRRORACRYLIC, ROUND, SQUARE, useNeonBuilderContext } from "../../../context/NeonBuilderContext";
import { AnimatePresence } from "framer-motion";
import { useGlobalContext } from '../../../context/GlobalContext';
import catchAsync from '../../../utils/catchASync';
import Axios from "../../../utils/Axios";
import LoadingBtn from '../../LoadingBtn';
import { useState } from "react";

const Controls = () => {
  const [globalState, setGlobalState] = useGlobalContext();
  const [state, setState] = useNeonBuilderContext();
  const [loading, setLoading] = useState(false);

  const addToCart = () => catchAsync(async () => { 
    // check text
     if (!state.data.text) {
       setState((state) => ({
         ...state,
         error: {
           ...state.error,
           text: "Please write what would you like your neon to say",
         },
       }));
       // scroll to error section
       return document
         .getElementById("text")
         .scrollIntoView({ behavior: "smooth" });
     }
    // check concent
     if (!state.data.concent) {
       setState((state) => ({
         ...state,
         error: {
           ...state.error,
           concent: "Pleae check this box to proceed",
         },
       }));
       // scroll to error section
       return document
         .getElementById("concent")
         .scrollIntoView({ behavior: "smooth" });
     }
    
    const customItem = { ...state.data, size: state.data.size.name, count: 1 };

    setLoading(true);

    let res;
    
    if (globalState.cartData.cart?.items || globalState.cartData.cart?.customItems) {
      res = await Axios.patch("cart", {
        items: globalState.cartData.cart?.items,
        customItems: [...globalState.cartData.cart?.customItems, customItem],
      });
    } else {
      res = (await Axios.post("cart", { customItems: [customItem] }));
    }
    
    setLoading(false)
    setGlobalState(state => ({ ...state, cartData: { ...state.cartData, cart: res.data.cart, show: true } }));
  
  }, setGlobalState, () => setLoading(false));


  return (
    <div className="lg:max-w-[430px] lg:p-5 h-full overflow-hidden">
      <div className=" flex flex-col bg-gray-200 relative overflow-hidden h-full ">
        <AnimatePresence>
          {state.controls.showNavigation && <Navigation />}
        </AnimatePresence>
        <div className="flex flex-col gap-8 p-5 pb-20 lg:pb-5 overflow-auto">
          <div className="grid gap-2" id="text">
            <label htmlFor="text-box" className="text-center text-lg p-2">
              {state.error.text ? (
                <span className="text-red-500">{state.error.text}</span>
              ) : (
                " What would you like your neon to say?"
              )}
            </label>
            <textarea
              rows="3"
              id="text-box"
              className=" p-1 outline-none "
              placeholder="what's on your mind? "
              value={state.data.text}
              onChange={(e) =>
                setState((state) => ({
                  ...state,
                  data: {
                    ...state.data,
                    text: e.target.value,
                    width: calcWidth({
                      text: e.target.value,
                      sizeName: state.data.size.name,
                      icon: state.data.icon,
                    }),
                    price: calcPrice({
                      text: e.target.value,
                      sizeName: state.data.size.name,
                      icon: state.data.icon,
                    }),
                  },
                  controls: { ...state.controls, typing: true },
                  error: { ...state.error, text: "" },
                }))
              }
            ></textarea>
          </div>
          <div className="grid gap-2" id="font">
            <h2 className="text-center text-lg p-2">
              Choose a font that suits your style
            </h2>
            <div className="grid gap-3 grid-cols-3 text-white">
              {fonts.map((font, i) => (
                <button
                  className={`py-3  transition overflow-hidden ${
                    state.data.font.family === font.family
                      ? "bg-gray-900  text-white "
                      : "bg-white text-black"
                  }  ${font.family === "MontserratRegular" ? "text-xs" : ""}`}
                  key={i}
                  style={{ fontFamily: font.family }}
                  title={font.text}
                  onClick={() =>
                    setState((state) => ({
                      ...state,
                      data: { ...state.data, font },
                    }))
                  }
                >
                  {font.text}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2" id="color">
            <h2 className="text-center text-lg p-2">Pick your color</h2>
            <div className="grid gap-4 grid-cols-4 text-sm">
              {colors.map((color, i) => (
                <button
                  className={`capitalize  flex flex-col items-center gap-2 transition p-2 ${
                    state.data.color.name === color.name
                      ? "bg-gray-900 text-white "
                      : "bg-white text-black "
                  }`}
                  key={i}
                  onClick={() =>
                    setState((state) => ({
                      ...state,
                      data: { ...state.data, color },
                    }))
                  }
                >
                  {color.name !== "multiple color" && (
                    <div
                      className={`h-8 w-8 rounded-full ${
                        color.name === "white" ? "border border-black" : ""
                      }`}
                      style={{
                        background: `rgb(${color.r}, ${color.g}, ${color.b})`,
                      }}
                    ></div>
                  )}
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2" id="size">
            <h2 className="text-center text-lg p-2 ">
              Select your size
              <span className="font-semibold"> (in inches)</span>{" "}
            </h2>
            {sizes.map((size, i) => (
              <button
                className={`p-2 capitalize transition ${
                  state.data.size.name === size.name
                    ? "bg-gray-900 text-white "
                    : "bg-white text-black "
                }`}
                onClick={() =>
                  setState((state) => ({
                    ...state,
                    data: {
                      ...state.data,
                      size,
                      width: calcWidth({
                        text: state.data.text,
                        sizeName: size.name,
                        icon: state.data.icon,
                      }),
                      price: calcPrice({
                        text: state.data.text,
                        sizeName: size.name,
                        icon: state.data.icon,
                      }),
                    },
                  }))
                }
                key={i}
              >
                <p className="font-semibold">{size.name}</p>
                <p>letter width: {size.letter.width}"</p>
                <p>
                  icon size: {size.icon.height}"x{size.icon.width}"
                </p>
              </button>
            ))}
          </div>
          <div className="grid gap-2" id="icon">
            <h2 className="text-center text-lg p-2 ">
              Add an Icon
              <span className="font-semibold"> (optional)</span>{" "}
            </h2>
            <div className="grid gap-4 grid-cols-4">
              {icons.map((icon, i) => (
                <button
                  className={`transition  ${
                    state.data.icon.name === icon.name
                      ? "bg-gray-900"
                      : "bg-gray-400"
                  }`}
                  key={i}
                  title={icon.name}
                  onClick={() =>
                    setState((state) => ({
                      ...state,
                      data: {
                        ...state.data,
                        icon: state.data.icon.name === icon.name ? "" : icon,
                        width: calcWidth({
                          text: state.data.text,
                          sizeName: state.data.size.name,
                          icon: state.data.icon.name === icon.name ? "" : icon,
                        }),
                        price: calcPrice({
                          text: state.data.text,
                          sizeName: state.data.size.name,
                          icon: state.data.icon.name === icon.name ? "" : icon,
                        }),
                      },
                    }))
                  }
                >
                  <img src={`/img/neon-logos/${icon.link}`} alt={icon.name} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 " id="backing-color">
            <h2 className="text-center text-lg p-2">Color of backing</h2>
            <BackingColor
              title="clear acrylic"
              text="Acrylic backing with transparent color"
              color={CLEARACRYLIC}
            />
            <BackingColor
              title="black acrylic"
              text="Acrylic backing with black color"
              color={BLACKACRYLIC}
            />
            <BackingColor
              title="mirror acrylic"
              text="Acrylic backing with mirror"
              color={MIRRORACRYLIC}
            />
            <BackingColor
              title="gold mirror acrylic"
              text=" Acrylic backing with gold mirror"
              color={GOLDMIRRORACRYLIC}
            />
          </div>
          <div className="grid gap-2 " id="backing-type">
            <h2 className="text-center capitalize text-lg p-2">Backing type</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              <BackingType title="square" type={SQUARE} />
              <BackingType title="round" type={ROUND} />
              <BackingType title="cut to shape" type={CUT_TO_SHAPE} />
            </div>
          </div>
          <div className="grid gap-2" id="mount-type">
            <h2 className="text-center text-lg p-2">
              select how you want to mount your neon
            </h2>
            <div className="flex justify-center gap-2 uppercase">
              <MountBtn type="WALL" />
              <MountBtn type="HANGING" />
            </div>
          </div>
          <div className="grid gap-2" id="note">
            <label htmlFor="note-box" className="text-center text-lg p-2">
              Need to be more specific?
            </label>
            <textarea
              id="note-box"
              rows="3"
              placeholder="Your note here"
              className="p-2"
              onChange={(e) =>
                setState((state) => ({
                  ...state,
                  data: { ...state.data, note: e.target.value },
                }))
              }
            ></textarea>
          </div>
          <div className="grid gap-2" id="concent">
            {state.error.concent && (
              <p className="text-red-500 text-center">{state.error.concent}</p>
            )}
            <div className="flex gap-3 items-center">
              <input
                type="checkbox"
                checked={state.data.concent}
                id="concent-box"
                className="scale-[1.5]"
                onChange={() =>
                  setState((state) => ({
                    ...state,
                    data: {
                      ...state.data,
                      concent: !state.data.concent,
                    },
                    error: { ...state.error, concent: "" },
                  }))
                }
              />
              <label htmlFor="concent-box" className="text-sm">
                All custom orders subject to approval, any required changes will
                be sent for approval. This will not delay your order.
              </label>
            </div>
          </div>
        </div>
        <div className="flex fixed lg:static bottom-0 inset-x-0 items-center justify-center lg:justify-start  gap-2 py-2 lg:p-4 bg-gray-300 border-t border-gray-300">
          <div className="lg:mt-auto  ">
            <button
              className="p-2 bg-gray-900 text-white grid gap-1"
              onClick={() =>
                setState((state) => ({
                  ...state,
                  controls: { ...state.contorls, showNavigation: true },
                }))
              }
            >
              <div className="bg-white h-[2px] w-5"></div>
              <div className="bg-white h-[2px] w-5"></div>
              <div className="bg-white h-[2px] w-5"></div>
            </button>
          </div>
          <div className="lg:flex-1 grid gap-2">
            <LoadingBtn
              loading={loading}
              className="bg-gray-900 max-w-max mx-auto px-8 py-3 uppercase text-white text-xs flex justify-center items-center gap-2 "
              onClick={addToCart}
            >
              <FaCartArrowDown className="text-xl" />
              <span>add to cart</span>
            </LoadingBtn>
            <CustomLink
              target="_blank"
              href="/contact"
              text="Got a logo? send us your details"
              className="font-semibold text-center hidden lg:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;


const BackingColor = ({ title, text, color }) => {

  const [state, setState] = useNeonBuilderContext(); 
  const selected = color === state.data.backing.backingColor; 

  return (
    <button
      className={`flex items-center justify-between  p-3  gap-2 ${
        selected ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
      onClick={() =>
        setState((state) => ({
          ...state,
          data: { ...state.data, backing: {...state.data.backing, backingColor:color}},
        }))
      }
    >
      <div className="flex-1 text-left">
        <h3 className="uppercase font-semibold">{title}</h3>
        <p className={` text-sm`}>
          {text}
        </p>
      </div>
    </button>
  );
};


const BackingType = ({ title, type }) => {
  const [state, setState] = useNeonBuilderContext();
  const selected = type === state.data.backing.backingType;

  return (
    <button
      className={`flex items-center justify-between  p-3  gap-2 ${
        selected ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
      onClick={() =>
        setState((state) => ({
          ...state,
          data: { ...state.data, backing: { ...state.data.backing, backingType: type } },
        }))
      }
    >
      <h3 className="uppercase font-semibold">{title}</h3>
    </button>
  );
};




const MountBtn = ({ type }) => {
  const [state, setState] = useNeonBuilderContext();
  const selected = state.data.mountType === type;

  return (
    <button
      className={`p-2  transition uppercase ${
        selected ? "bg-gray-900 text-white" : "bg-white black"
      }`}
      onClick={() =>
        setState((state) => ({
          ...state,
          data: { ...state.data, mountType: type },
        }))
      }
    >
      {type}
    </button>
  );
};