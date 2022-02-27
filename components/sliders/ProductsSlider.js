import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import CustomLink from "../CustomLink";

const ProductsSlider = ({products}) => { 
 
  const [review, setreview] = useState(0);

  const { width } = useWindowDimensions();

  useEffect(() => setreview(0), [width]);
  return (
    <div className="relative">
      <Controls
        review={review}
        setreview={setreview}
        products={products}
        width={width}
      />
      <div className="relative overflow-hidden">
        <motion.div
          className="flex mt-20"
          style={{ width: `${products.length * 100}%` }}
          initial={{ x: 0 }}
          animate={{
            x: `-${(review / products.length) * 100}%`,
            transition: { duration: 0.5 },
          }}
        >
          {products.map((product, i) => (
            <div
              className={`px-5`}
              key={i}
              style={{
                width:
                  width >= 768
                    ? `${(1 / products.length) * 33.33}%`
                    : width >= 640
                    ? `${(1 / products.length) * 100}%`
                    : `${(1 / products.length) * 100}%`,
              }}
            >
              <ProductPreview
                product={product}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductsSlider;

const Controls = ({ setreview, review, products, width }) => {
  return (
    <div className="absolute z-10 top-1/2 -inset-x-5 transform translate-y-10 flex justify-between text-3xl">
      <button
        className="transform focus:outline-none focus:scale-125 focus:ring-2 transition py-5 bg-black text-white disabled:bg-gray-800"
        disabled={review === 0}
        onClick={() => setreview(review - 1)}
      >
        <FaCaretLeft />
      </button>
      <button
        className="transform focus:outline-none focus:scale-125 focus:ring-2 transition py-5 bg-black text-white disabled:bg-gray-800"
        disabled={
          width >= 768
            ? review >= Math.floor((products.length - 1) / 3)
            : review >= Math.floor((products.length - 1) / 1)
        }
        onClick={() => setreview(review + 1)}
      >
        <FaCaretRight />
      </button>
    </div>
  );
}; 



const ProductPreview = ({product}) => {

  const discountPrice =
    product.salePercentage > 0
      ? product.sizes[0].price - (product.sizes[0].price * product.salePercentage) / 100
      : product.sizes[0].price;
  return (
    <div className="flex-1 flex flex-col items-center gap-5 text-black relative shadow-2xl border border-gray-200 pb-2">
      <CustomLink
        href={`/shop/${product.category.slug}/${product.slug}`}
        className="relative"
      >
        {product.salePercentage > 0 && (
          <div className="absolute bg-red-500 py-1 px-2 text-white z-10">
            -{product.salePercentage}%
          </div>
        )}
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="object-cover h-full"
        />
      </CustomLink>
      <p className="uppercase">{product.name}</p>
      {product.salePercentage > 0 ? (
        <div className="flex items-center font-semibold text-2xl text-gray-600">
          <p>$</p>
          <p>{discountPrice}</p>
          <p className="relative">
            <span className="absolute left-1 -top-5 text-[17px] line-through  text-red-500">
              ${product.sizes[0].price}
            </span>
          </p>
        </div>
      ) : (
        <p className="flex items-center font-semibold text-2xl text-gray-600">
          <span>$</span>
          <span>{product.sizes[0].price}</span>
        </p>
      )}
      <CustomLink
        href={`/shop/${product.category.slug}/${product.slug}`}
        text="buy now"
        className="px-5 py-2 sm:px-10 sm:py-3 md:px-16 flex items-center justify-center bg-black text-white uppercase"
      />
    </div>
  );
};
