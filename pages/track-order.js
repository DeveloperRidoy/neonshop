import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomLink from "../components/CustomLink";
import LoadingBtn from "../components/LoadingBtn";
import NeonPreview from "../components/NeonPreview";
import { useGlobalContext } from "../context/GlobalContext";
import Axios from "../utils/Axios";
import catchASync from "../utils/catchASync";
import { colors } from "../utils/CustomNeonAssets";

const TrackOrder = () => {
  const Router = useRouter();
  const [, setGlobalState] = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(false);
  const [data, setData] = useState({
    orderId: "",
    email: "",
  });

  const findOrder = ({ e, orderData }) =>
    catchASync(
      async () => {
        if (e) e.preventDefault();
        setLoading(true);
        const res = await Axios.post("orders/track-order", orderData || data);
        setOrder(res.data.order);
        setLoading(false);
      },
      setGlobalState,
      () => setLoading(false)
    );

  useEffect(async () => {
    const orderId = Router.query.orderId;
    const email = Router.query.email;
    if (!orderId || !email) return;
    const orderData = { orderId, email };
    findOrder({ orderData });
  }, [Router.query.orderId, Router.query.email]);

  return (
    <div className="px-5 lg:px-20 py-20  bg-gray-200">
      <Head>
        <title>Track Order | NeonSignCo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center gap-3 md:max-w-[800px] mx-auto">
        <h1 className="text-3xl md:text-5xl text-center mb-10 font-semibold">
          Track your order
        </h1>
        <form
          onSubmit={(e) => findOrder({ e })}
          className="grid sm:grid-cols-3 gap-2 text-lg mb-5 w-full"
        >
          <input
            type="text"
            value={data.orderId}
            placeholder="Order Id"
            className="p-2 bg-white border border-gray-300"
            title="Your order Id"
            onChange={(e) =>
              setData((data) => ({ ...data, orderId: e.target.value }))
            }
            required
          />
          <input
            type="email"
            value={data.email}
            placeholder="Email"
            className="p-2 bg-white border border-gray-300"
            title="Email address that was used to order"
            onChange={(e) =>
              setData((data) => ({ ...data, email: e.target.value }))
            }
            required
          />
          <LoadingBtn
            loading={loading}
            type="submit"
            className="py-2 px-4 bg-black text-white"
          >
            Track Order
          </LoadingBtn>
        </form>
        {order && <OrderDetails order={order} />}
      </div>
    </div>
  );
};

export default TrackOrder;

const OrderDetails = ({ order }) => {
  const date = new Date(order.createdAt).toLocaleDateString();

  return (
    <div className="flex flex-col gap-5 bg-white p-5 w-full">
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
                className="py-10 bg-black text-5xl overflow-hidden "
                iconClass="h-20 lg:h-20 "
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
            src={item.product.images?.[0]?.url}
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
