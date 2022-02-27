import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa'
import { useGlobalContext } from '../context/GlobalContext';

const Banner = () => {
    const [, setState] = useGlobalContext();


    const closeBanner = () => {
        localStorage.setItem('showBanner', false);
        setState(state => ({ ...state, showBanner: false }));
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-900 p-2 flex"
      >
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-y-1 text-white font-semibold text-xs md:text-base">
          Get Free Shipping on all orders!
        </div>
        <button
          className="text-white sm:px-2 text-gray-400"
          onClick={closeBanner}
        >
          {" "}
          <FaTimes />
        </button>
      </motion.div>
    );
}

export default Banner
