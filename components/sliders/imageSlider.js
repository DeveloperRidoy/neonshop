import { useState } from "react";
import { motion } from "framer-motion";
import { FaCaretLeft, FaCaretRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const ImageSlider = ({ images }) => {
  const [review, setreview] = useState(0);

  return (
    <div className="relative">
      <Controls
        review={review}
        setreview={setreview}
        images={images}
      />
      <div className="relative overflow-hidden">
        <motion.div
          className="flex"
          style={{ width: `${images.length * 100}%` }}
          initial={{ x: 0 }}
          animate={{
            x: `-${(review / images.length) * 100}%`,
            transition: { duration: 0.5 },
          }}
        >
          {images.map((image, i) => (
            <div
              key={i}
              style={{
                width: `${(1 / images.length) * 100}%`,
              }}
            >
              <img src={image.url} alt={image.alt} className="w-full"/>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ImageSlider;

const Controls = ({ setreview, review, images }) => {
  return (
    <div className="absolute z-10 top-1/2 -translate-y-1/2  inset-x-0 transform  flex justify-between text-3xl text-white">
      <button
        className="transform focus:outline-none  transition py-5 disabled:text-gray-500 "
        disabled={review === 0}
        onClick={() => setreview(review - 1)}
      >
        <BsChevronLeft />
      </button>
      <button
        className="transform focus:outline-none  transition py-5 disabled:text-gray-500 "
        disabled={review >= images.length - 1}
        onClick={() => setreview(review + 1)}
      >
        <BsChevronRight />
      </button>
    </div>
  );
};