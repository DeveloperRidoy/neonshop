import { motion } from "framer-motion";
import { BsX } from "react-icons/bs";
import { useGlobalContext } from "../../context/GlobalContext";
import CustomNeonSignModal from "./CustomNeonSignModal";


// types of model 
export const CUSTOMNEONMODEL = "CUSTOMNEONMODEL";


const ModalContainer = () => {
    
    const [state, setState] = useGlobalContext();
  const close = () => setState(state => ({ ...state, modal: { ...state.modal, show: false } }));
    return (
      <motion.div
        initial={{ opacity: 0, top: "-100%" }}
        animate={{ opacity: 1, top: "0" }}
        exit={{ opacity: 0 }}
        className="fixed inset-1/2 flex items-center justify-center z-20"
      >
        <div className="min-w-max">
          {state.modal.type === CUSTOMNEONMODEL && (
            <CustomNeonSignModal close={close} />
          )}
        </div>
      </motion.div>
    );
}

export default ModalContainer
 