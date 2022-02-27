import { AnimatePresence, motion } from "framer-motion";
import { useNeonBuilderContext } from "../../../../context/NeonBuilderContext";
import NeonPreview from "../../../NeonPreview";


const Visuals = () => {
  const [state] = useNeonBuilderContext();
  
  return (
    <div
      className="w-full min-h-[200px] lg:h-auto flex text-white  relative overflow-hidden p-4"
    >
      {state.data.text || state.data.icon.name ? (
        <>
          <AnimatePresence>
            {!state.controls.typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-auto text-2xl md:text-5xl absolute top-3 right-3 "
              >
                $
                <span className="italic">
                  {Number(state.data.price).toFixed(2)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <NeonPreview
            text={state.data.text}
            color={state.data.color}
            icon={state.data.icon}
            font={state.data.font}
            typing={state.controls.typing}
            width={state.data.width}
            textClass="text-5xl md:text-7xl lg:text-9xl"
            iconClass="h-24 lg:h-56"
          />
        </>
      ) : (
        <div className="h-full w-full flex flex-col gap-5 justify-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl lg:text-5xl capitalize text-center"
          >
            neon sign builder
          </motion.h2>
          <p className="text-4xl capitalize text-center">start typing! </p>
        </div>
      )}
    </div>
  );
};

export default Visuals;
