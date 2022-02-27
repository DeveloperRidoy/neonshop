import { useState } from "react";
import { useACcountContext } from "../../../../pages/account";
import { colors } from "../../../../utils/CustomNeonAssets";
import CustomLink from "../../../CustomLink";
import NeonPreview from "../../../NeonPreview";

const MyOrdersSection = () => {
  const [state] = useACcountContext();
  return (
    <div className="bg-white w-full">
      <h2 className="text-xl font-semibold capitalize">orders</h2>
      <div className="grid gap-10 mt-5">
        {state.orders?.length > 0 ? (
          state.orders.map((order) => (
            <OrderItem key={order._id} order={order} />
          ))
        ) : (
          <div className="">No orders yet!</div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersSection;

const OrderItem = ({ order }) => {
  const [expand, setExpand] = useState(false);

  return (
    <div className="p-2 border border-gray-300">
      {expand ? (
        <ExpandedContent order={order} setExpand={setExpand} />
      ) : (
        <Preview order={order} setExpand={setExpand} />
      )}
    </div>
  );
};

const ExpandedContent = ({ order, setExpand }) => {
  const date = new Date(order.createdAt).toLocaleDateString();

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold">Order</h2>
        <p>
          <span className="font-semibold">Date:</span> {date}
        </p>
        <p>
          <span className="font-semibold">Order Id:</span> {order._id}
        </p>
        <div className="grid">
          <p className="font-semibold capitalize">status</p>
          <p
            className={`capitalize ${
              order.status === "ORDERED"
                ? "text-gray-500"
                : order.status === "DELIVERED"
                ? "text-green-500"
                : order.status === "CANCELLED" && "text-red-500"
            } `}
          >
            {order.status === "ORDERED"
              ? "ordered"
              : order.status === "PROCESSING"
              ? "processing"
              : order.status === "DELIVERED"
              ? "delivered"
              : order.status === "CANCELLED" && "cancelled"}
          </p>
        </div>
      </div>
      {order.customItems?.length > 0 && (
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold">Custom Neons</h2>
          {order.customItems.map((item) => (
            <div
              className="grid gap-2 border border-gray-300 p-2"
              key={item._id}
            >
              <NeonPreview
                text={item.text}
                color={colors.find((color) => color.hex === item.color.hex)}
                icon={item.icon}
                font={item.font}
                textClass="text-5xl md:text-3xl"
                className="py-5 w-full md:w-60 bg-black overflow-hidden "
                iconClass="h-20"
                hideWidth
              />

              <p>
                <span className="font-semibold">Text: </span> {item.text}
              </p>
              <p>
                <span className="font-semibold">Font: </span> {item.font.text}
              </p>
              <p>
                <span className="font-semibold">Color: </span> {item.color.name}
              </p>
              <p>
                <span className="font-semibold">Size: </span> {item.size}
              </p>
              <p>
                <span className="font-semibold">Width: </span> {item.width}"
              </p>
              <p>
                <span className="font-semibold">Icon: </span>{" "}
                {item.icon ? (
                  <img
                    src={`/img/neon-logos/${item.icon.link}`}
                    alt={item.icon.name}
                    title={item.icon.name}
                    className="bg-black h-10 w-10 rounded"
                  />
                ) : (
                  "none"
                )}
              </p>
              <p>
                <span className="font-semibold">Mount type: </span>{" "}
                {item.mountType}
              </p>
              <p>
                <span className="font-semibold">Count: </span> {item.count}
              </p>
              <p>
                <span className="font-semibold">Price: </span> ${item.price}
              </p>
            </div>
          ))}
        </div>
      )}
      {order.items?.length > 0 && (
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold">Neons</h2>
          <div className="hidden md:block">
            <table className="w-full bg-white  border border-gray-500">
              <thead className="h-12 border-b border-gray-200">
                <tr className="border border-gray-200 ">
                  <th className="text-left pl-2">Image</th>
                  <th className="text-left">name</th>
                  <th className="text-left">size</th>
                  <th className="text-left">color</th>
                  <th className="text-left">mount type</th>
                  <th className="text-left">count</th>
                  <th className="text-left">price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <TableItem key={item._id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden grid gap-1">
            {order.items.map((item) => (
              <Item key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-1">
        <h2 className="text-lg font-semibold">Totals</h2>
        <p>
          <span className="font-semibold">Subtotal: </span> ${order.subTotal}
        </p>
        <p>
          <span className="font-semibold">Shipping: </span> Free
        </p>
        <p>
          <span className="font-semibold">Total: </span> ${order.total}
        </p>
      </div>
      <button
        className="ml-auto py-1 px-4 bg-black text-white"
        onClick={() => setExpand((bool) => !bool)}
      >
        Close
      </button>
    </div>
  );
};

const TableItem = ({ item }) => {
  return (
    <tr className="border border-gray-300">
      <td className="pl-2">
        <CustomLink
          href={`shop/${item.product.category.slug}/${item.product.slug}`}
        >
          <img
            src={item.product.image[0]?.url}
            alt={item.product.name}
            className="h-16"
          />
        </CustomLink>
      </td>
      <td>{item.product.name}</td>
      <td>{item.selectedSize.info}</td>
      <td>{item.selectedColor.name}</td>
      <td>{item.selectedMountType}</td>
      <td>{item.count}</td>
      <td>${item.selectedSize.price}</td>
    </tr>
  );
};

const Item = ({ item }) => {
  return (
    <div className="grid gap-2 border border-gray-300 p-2">
      <CustomLink
        href={`shop/${item.product.category.slug}/${item.product.slug}`}
      >
        <img
          src={item.product.images?.[0]?.url}
          alt={item.product.name}
          className=""
        />
      </CustomLink>

      <p>
        <span className="font-semibold">Name: </span> {item.product.name}
      </p>
      <p>
        <span className="font-semibold">Size: </span> {item.selectedSize.info}
      </p>
      <p>
        <span className="font-semibold">Color: </span> {item.selectedColor.name}
      </p>
      <p>
        <span className="font-semibold">Mount type: </span>{" "}
        {item.selectedMountType}
      </p>
      <p>
        <span className="font-semibold">Count: </span> {item.count}
      </p>
      <p>
        <span className="font-semibold">Price: </span> $
        {item.selectedSize.price}
      </p>
    </div>
  );
};

const Preview = ({ order, setExpand }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {order.customItems?.map((item) => (
            <NeonPreview
              key={item._id}
              text={item.text}
              font={item.font}
              color={colors.find((color) => color.hex === item.color.hex)}
              icon={item.icon}
              className="h-20 w-20 overflow-hidden bg-black"
              iconClass="h-10 lg:h-7"
              hideWidth
            />
          ))}
          {order.items?.map((item, i) => (
            <img
              key={i}
              src={item.product.images?.[0]?.url}
              alt="product name"
              className="h-20 w-20 object-cover"
            />
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-x-5 gap-y-2 md:gap-10">
          <div className="grid">
            <p className="font-semibold capitalize">order id</p>
            <p>{order._id}</p>
          </div>
          <div className="grid">
            <p className="font-semibold capitalize">items</p>
            <p>{order.items?.length || 0 + order.customItems?.length || 0}</p>
          </div>
          <div className="grid">
            <p className="font-semibold capitalize">total</p>
            <p>${order.total}</p>
          </div>
          <div className="grid">
            <p className="font-semibold capitalize">status</p>
            <p
              className={`capitalize ${
                order.status === "ORDERED"
                  ? "text-gray-500"
                  : order.status === "DELIVERED"
                  ? "text-green-500"
                  : order.status === "CANCELLED" && "text-red-500"
              } `}
            >
              {order.status === "ORDERED"
                ? "ordered"
                : order.status === "PROCESSING"
                ? "processing"
                : order.status === "DELIVERED"
                ? "delivered"
                : order.status === "CANCELLED" && "cancelled"}
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <button
          className=" border border-gray-300 p-2 uppercase font-semibold transition bg-gray-200 hover:bg-gray-300 whitespace-nowrap"
          onClick={() => setExpand(true)}
        >
          view order
        </button>
      </div>
    </div>
  );
};
