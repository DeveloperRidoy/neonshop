import { calcPrice, calcWidth } from "../../utils/CustomNeonAssets";
import Product from "../models/product";
import AppError from "./AppError";

const calcCartPrice = async function (doc) {
  return new Promise(async (resolve, reject) => {
    try {
      let subTotal = 0;
      let total = 0;
      let addedItems = [];  
      let addedCustomItems = [];
      
      // check if cart is empty
      if (!doc.items && !doc.customItems) throw new AppError(400, 'cart is empty');
      if (doc.items?.length <= 0 && doc.customItems?.length <= 0) throw new AppError(400, 'cart is empty');
      
      // for regular items
        if (doc.items?.length > 0) {
          await Promise.all(
            doc.items.map(async (item) => {
              // ignore if count is 0
              if (item.count <= 0) return;

              // check product
              const product = await Product.findById(item.product);
              if (!product)
                throw new AppError(404, "product in cart not found");

              // adjust size if updated
              const size =
                product.sizes.find(
                  (size) =>
                    String(size._id) === String(item.selectedSize.sizeId)
                ) || product.sizes[0];

              
              // update price
              const price =
                product.salePercentage > 0
                  ? size.price - (size.price * product.salePercentage) / 100
                  : size.price;

              item.selectedSize = {
                info: size.info,
                price,
                sizeId: size._id,
              };    
              
              // update total price
              subTotal += item.count * price;
              total += item.count * price;

              // check duplicate item
              const dupIndex = addedItems.findIndex(
                (i) => {
                  return (
                    String(i.product._id) === String(item.product._id) &&
                    i.selectedColor.hex === item.selectedColor.hex &&
                    String(i.selectedSize.sizeId) === String(item.selectedSize.sizeId) &&
                    i.selectedMountType === item.selectedMountType
                  );
                }                  
              );
                
              // update count for duplicate item
              if (dupIndex !== -1)
                return (addedItems[dupIndex].count += item.count);

              // add to items
              addedItems.push(item);
            })
             );
      }
      
      // for custom items 
      if (doc.customItems?.length > 0) {
        doc.customItems.forEach(item => {
          // ignore if count is 0
          if (item.count <= 0) return;

          // check duplicate item
          const dupIndex = addedCustomItems.findIndex(
            (i) =>
              i.text === item.text &&
              i.font.family === item.font.family &&
              i.color.hex === item.color.hex &&
              i.size === item.size &&
              i.icon.link === item.icon.link &&
              i.icon.name === item.icon.name &&
              i.backing.backingType === item.backing.backingType &&
              i.backing.backingColor === item.backing.backingColor && 
              i.mountType === item.mountType &&
              i.note === item.note
          );

          // update item width and price according to size
          item.width = calcWidth({
            text: item.text,
            sizeName: item.size,
            icon: item.icon,
          });
          item.price = calcPrice({
            text: item.text,
            sizeName: item.size,
            icon: item.icon,
          });

          // update total price
          subTotal += item.price * item.count;
          total += item.price * item.count;

          // update count for duplicate item
          if (dupIndex !== -1) {
            addedCustomItems[dupIndex].count += item.count;
            return;
          }

          // add to customItems
          addedCustomItems.push(item);
        })
      }
      doc.subTotal = subTotal;
      doc.total = total;
      doc.items = addedItems;
      doc.customItems = addedCustomItems;
      resolve(doc);
    } catch (error) {
      reject(error.code ? error : new AppError(400, error.message));
    }
  });
};


export default calcCartPrice;