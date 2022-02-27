import Cart from '../models/cart';
import Product from '../models/product';
import Category from '../models/category';
import { calcPrice, calcWidth } from '../../utils/CustomNeonAssets'

const getUpdatedCart = ({ userId, tempUserId }) => new Promise(async (resolve, reject) => {
  try {
    let cart; 
    let tempUserCart
    
    if (userId) {
      cart = await Cart.findOne({ userId }).populate({
        path: "items.product",
        model: Product,
        populate: { path: "category", model: Category },
      });
    } 

    if (tempUserId) {
      tempUserCart = await Cart.findOne({ userId: tempUserId }).populate({
        path: "items.product",
        model: Product,
        populate: { path: "category", model: Category },
      });;
    }

    if (cart && tempUserCart) {
      let items = []; 
      let customItems = [];

      // merge all items
      cart.items.forEach((i) => items.push(i));
      cart.customItems.forEach((i) => customItems.push(i));
      tempUserCart.items.forEach((i) => items.push(i));
      tempUserCart.customItems.forEach((i) => customItems.push(i));

      // update cart
      const { filteredCart } = filterCart({ items, customItems });
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        filteredCart,
        { new: true, runValidators: true }
      ).populate({
        path: "items.product",
        model: Product,
        populate: { path: "category", model: Category },
      });;
      
      // delete temporary cart 
      await tempUserCart.delete();

      resolve(updatedCart);
    }

    if (cart && !tempUserCart) {
      // delete if empty
      if (
        cart.items.length <= 0 &&
        cart.customItems.length <= 0
      ) {
        await cart.delete();
        return resolve({});
      }
      const { changed, filteredCart } = filterCart(cart);

      // update if change needed
      if (changed) {
        const updatedCart = await Cart.findOneAndUpdate(
          { userId },
          filteredCart,
          { new: true, runValidators: true }
        ).populate({
          path: "items.product",
          model: Product,
          populate: { path: "category", model: Category },
        });;

        return resolve(updatedCart);
      }
      return resolve(cart);
    }

    if (!cart && tempUserCart) {
      // delete if empty
      if (
        tempUserCart.items.length <= 0 &&
        tempUserCart.customItems.length <= 0
      ) {
        await tempUserCart.delete();
        return resolve({});
      }

      const { changed, filteredCart } = filterCart(tempUserCart);

      // if logged in, add new cart under user with filteredCart data and delete the temtpUserCart
      if (userId) {
        // create new cart with tempUserCart data
        const newCart = await Cart.findOneAndUpdate(
          { userId },
          {
            items: filteredCart.items,
            customItems: filteredCart.customItems,
            subTotal: filteredCart.subTotal,
            total: filteredCart.total,
            discount: filteredCart.discount,
            userId,
          },
          { new: true, upsert: true, runValidators: true }
        );

        // delete tempUserCart
        await tempUserCart.delete();

        return resolve(newCart);
      }

      // update if change needed
      if (changed) {
        const updatedCart = await Cart.findOneAndUpdate(
          { userId: tempUserId },
          filteredCart,
          { new: true, runValidators: true }
        ).populate({
          path: "items.product",
          model: Product,
          populate: { path: "category", model: Category },
        });

        return resolve(updatedCart);
      }
      return resolve(tempUserCart);
    }

    if (!cart && !tempUserCart) resolve({});

  } catch (error) {
    reject(error)
  }
})

export default getUpdatedCart;





const filterCart = (cart) => {
  const doc = JSON.parse(JSON.stringify(cart));
  let subTotal = 0;
  let total = 0;
  let addedItems = [];
  let addedCustomItems = [];
  let changed = false;

  // for regular items
  if (doc.items?.length > 0) {
   doc.items.forEach(async (item) => {
     // ignore if count is 0
     if (item.count <= 0) return (changed = true);

     if (!item.product) return changed = true;

     // adjust size if updated
     const size =
       item.product.sizes.find(
         (size) => String(size._id) === String(item.selectedSize.sizeId)
       ) || item.product.sizes[0];

     if (!size.sizeId) changed = true;

    
     // update price
     const price =
       item.product.salePercentage > 0
         ? size.price - (size.price * item.product.salePercentage) / 100
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
       (i) =>
         i.product === item.product &&
         i.selectedColor.hex === item.selectedColor.hex &&
         i.selectedSize._id === item.selectedSize._id &&
         i.selectedMountType === item.selectedMountType
     );

     // update count for duplicate item
     if (dupIndex !== -1)
       return (addedCustomItems[dupIndex].count += item.count);

     // add to items
     addedItems.push(item);
   });
  }

  // for custom items
  if (doc.customItems?.length > 0) {
    doc.customItems.forEach((item) => {
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
          i.backing.type === item.backing.type &&
          i.backing.color === item.backing.color &&
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
    });
  }
  doc.subTotal = subTotal;
  doc.total = total;
  doc.items = addedItems;
  doc.customItems = addedCustomItems;

  if (doc.subTotal !== subTotal || doc.total !== total) {
    changed = true
  };

  return {changed, filteredCart: doc}
}
