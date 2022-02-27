import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

const NeonPreview = ({text, color, icon, font, className, iconClass, typing, width, textClass, hideWidth}) => {

    const divRef = useRef();
    const textRef = useRef();

    // adjust text size to fit one line
    useEffect(() => {
      if (!divRef.current || !textRef.current) return;
      const divWidth = divRef.current.offsetWidth;
      const textWidth = textRef.current.offsetWidth;
      let scale = divWidth / textWidth;
      if (scale > 1) {
        scale = 1;
      } else {
        if (icon.name) scale = scale - scale * 0.28;
      }
      textRef.current.style.transform = `scale(${scale})`;
    }, [text, icon.name, font]);

    return (
      <div
        className={`flex w-full justify-center items-center overflow-hidden ${className}`}
        ref={divRef}
      >
        <div className="relative">
          <div className="" ref={textRef}>
            <div
              className={` transition-all relative flex items-center justify-center `}
            >
              {icon.name && (
                <img
                  src={`/img/neon-logos/${icon.link}`}
                  alt={icon.name}
                  className={`${iconClass}`}
                />
              )}
              <span
                className={`whitespace-nowrap ${textClass}`}
                style={{
                  textShadow: `0 0 10px rgba(${color.r},${color.g},${
                    color.b
                  },1),0 0 20px rgba(${color.r + 10},${color.g + 10},${
                    color.b + 10
                  },0.5),0 0 40px rgba(${color.r + 10},${color.g + 10},${
                    color.b + 10
                  },0.33)`,
                  color: `rgb(${color.r}, ${color.g}, ${color.b})`,
                  fontFamily: font.family,
                  transformStyle: "preserve-3d",
                }}
              >
                {text}
              </span>
            </div>
          </div>
          <AnimatePresence>
            {!typing && !hideWidth && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 absolute -bottom-7 md:-bottom-16 w-full"
              >
                <div className="h-[1px] bg-white flex-1 relative">
                  <div className="absolute -top-[6px] h-[13px] w-[2px] bg-white"></div>
                </div>
                {width}"
                <div className="h-[1px] bg-white flex-1 relative">
                  <div className="absolute -top-[6px] right-0 h-[13px] w-[2px] bg-white"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
}

export default NeonPreview
