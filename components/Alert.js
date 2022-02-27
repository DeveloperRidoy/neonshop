import { motion } from "framer-motion";
import { useEffect } from "react";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { SUCCESS, useGlobalContext } from "../context/GlobalContext"

 

const Alert = () => {

    const [state, setState] = useGlobalContext(); 

    useEffect(() => {
       const timer =  setTimeout(() => setState(state => ({ ...state, alert: { ...state.alert, show: false, timeout: 5000 } })), state.alert.timeout || 5000)
        

        return () => clearTimeout(timer);
    }, [])

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: {duration: .2} }}
        exit={{ scale: 0 }}
        className=" fixed top-1/4 inset-x-1/2 flex items-center justify-center z-50"
      >
        <div className="bg-white gap-4 flex pr-10 rounded overflow-hidden shadow-xl border border-gray-300 border-l-0 min-w-max">
          <div
            className={`p-[2.5px] flex-1 ${
              state.alert.type === SUCCESS ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          {state.alert.type === SUCCESS ? (
            <BsCheckCircle className="text-3xl self-center text-green-500" />
          ) : (
            <BsXCircle className="text-3xl self-center text-red-500" />
          )}
          <div className="grid gap-0 py-1">
            <p className="text-lg uppercase m-0 font-semibold">
              {state.alert.type}
            </p>
            <p className="text-gray-900 -mt-1">{state.alert.text}</p>
          </div>
        </div>
      </motion.div>
    );
}

export default Alert
