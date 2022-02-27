import { motion } from "framer-motion";
import { useGlobalContext } from "../../context/GlobalContext";
import CustomLink from "../CustomLink"
import MobileDropDown from "./MobileDropDown"

const MobileMenu = () => {
  const [state, setState] = useGlobalContext();
  
  const closeMenu = () =>
    setState((state) => ({ ...state, showMobileMenu: false }));

    return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0, transition: { duration: 0.2 } }}
        exit={{ x: "100%", transition: { duration: 0.2 } }}
        className={`fixed z-10  w-full bottom-0  bg-gray-900 lg:hidden text-lg uppercase text-white ${
          state.showBanner ? "top-[90px]" : "top-[58px]"
        }`}
      >
        <div className="py-5 px-5 flex flex-col gap-3 overflow-auto h-[calc(100vh-60px)]">
          <CustomLink
            href="/custom-neon-sign"
            text="design your neon"
            onClick={closeMenu}
          />
          <MobileDropDown closeMenu={closeMenu} title="shop neons" />
          <CustomLink href="/about" text="about" onClick={closeMenu} />
          <CustomLink href="/contact" text="contact" onClick={closeMenu} />
          <CustomLink
            href="/track-order"
            text="track order"
            onClick={closeMenu}
          />
        </div>
      </motion.div>
    );
}

export default MobileMenu
