import { motion } from "framer-motion";
import { useState } from "react";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { useAdminContext } from "../../../../pages/admin";
import LoadingBtn from "../../../../components/LoadingBtn";
import Axios from "../../../../utils/Axios";
import { SUCCESS, useGlobalContext } from "../../../../context/GlobalContext";
import catchAsync from "../../../../utils/catchASync";
import CustomLink from "../../../CustomLink";
import catchASync from "../../../../utils/catchASync";
import { colors } from "../../../../utils/CustomNeonAssets";
import NeonPreview from "../../../NeonPreview";

// variables
const ORDERED = "ORDERED";
const DELIVERED = "DELIVERED";
const CANCELLED = "CANCELLED";
const PROCESSING = "PROCESSING";
const OrderSection = () => {
  const [adminState, setAdminState] = useAdminContext();
  const [, setGlobalState] = useGlobalContext();
  const [state, setState] = useState({
    activeSection: ORDERED,
    selectedOrderIds: [],
    expandedOrder: "",
    loading: false,
  });

  const deleteProducts = () =>
    catchASync(
      async () => {
        const yes = confirm("Delete these orders ?");
        if (!yes) return;
        setState((state) => ({ ...state, loading: true }));
        await Axios.put("orders", {
          ids: state.selectedOrderIds,
        });
        setAdminState((adminState) => ({
          ...adminState,
          orders: adminState.orders.filter(
            (item) => !state.selectedOrderIds.includes(item._id)
          ),
        }));
        setState((state) => ({
          ...state,
          loading: false,
        }));
        setGlobalState((state) => ({
          ...state,
          alert: {
            ...state.alert,
            show: true,
            type: SUCCESS,
            text: "orders deleted",
            timeout: 3000,
          },
        }));
      },
      setGlobalState,
      () => setState((state) => ({ ...state, loading: false }))
    );

  return (
    <div className="py-5 md:p-10 w-full">
      {state.expandedOrder ? (
        <ExpandedOrder order={state.expandedOrder} setState={setState} />
      ) : (
        <div>
          <SearchBar setState={setState} />
          <div className="border mt-5">
            {state.selectedOrderIds.length > 0 && (
              <div className="p-2 pr-12 bg-white border flex justify-between">
                <p>delete these orders?</p>
                <LoadingBtn
                  loading={state.loading}
                  className="bg-red-500 text-white py-1 px-2"
                  onClick={deleteProducts}
                >
                  delete
                </LoadingBtn>
              </div>
            )}
            <div className=" grid grid-cols-4 items-start text-gray-500 text-xs md:text-base">
              <button
                className={`text-center p-2 uppercase font-semibold transition ${
                  state.activeSection === ORDERED ? "text-black " : ""
                }`}
                onClick={() =>
                  setState((state) => ({ ...state, activeSection: ORDERED }))
                }
              >
                ordered (
                {adminState.orders.filter((i) => i.status === ORDERED)
                  ?.length || 0}
                )
              </button>
              <button
                className={`text-center p-2 uppercase font-semibold transition ${
                  adminState.activeSection === PROCESSING ? "text-black " : ""
                }`}
                onClick={() =>
                  setState((state) => ({
                    ...state,
                    activeSection: PROCESSING,
                  }))
                }
              >
                processing (
                {adminState.orders.filter((i) => i.status === PROCESSING)
                  ?.length || 0}
                )
              </button>
              <button
                className={`text-center p-2 uppercase font-semibold transition ${
                  adminState.activeSection === DELIVERED ? "text-black " : ""
                }`}
                onClick={() =>
                  setState((state) => ({
                    ...state,
                    activeSection: DELIVERED,
                  }))
                }
              >
                delivered (
                {adminState.orders.filter((i) => i.status === DELIVERED)
                  ?.length || 0}
                )
              </button>
              <button
                className={`text-center p-2 uppercase font-semibold transition ${
                  state.activeSection === CANCELLED ? "text-black " : ""
                }`}
                onClick={() =>
                  setState((state) => ({
                    ...state,
                    activeSection: CANCELLED,
                  }))
                }
              >
                cancelled (
                {adminState.orders.filter((i) => i.status === CANCELLED)
                  ?.length || 0}
                )
              </button>
            </div>
            <div className="grid grid-cols-4 gap-10">
              {state.activeSection === ORDERED && (
                <motion.div
                  layoutId="actiev-indicator"
                  className="h-[2px] bg-purple-500 col-start-1"
                ></motion.div>
              )}
              {state.activeSection === PROCESSING && (
                <motion.div
                  layoutId="actiev-indicator"
                  className="h-[2px] bg-purple-500 col-start-2"
                ></motion.div>
              )}
              {state.activeSection === DELIVERED && (
                <motion.div
                  layoutId="actiev-indicator"
                  className="h-[2px] bg-purple-500 col-start-3"
                ></motion.div>
              )}
              {state.activeSection === CANCELLED && (
                <motion.div
                  layoutId="actiev-indicator"
                  className="h-[2px] bg-purple-500 col-start-4"
                ></motion.div>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <table className="w-full bg-white">
              <thead className="h-12 border-b border-gray-200">
                <tr className="border border-gray-200">
                  <th className="text-left pl-2">
                    <input
                      type="checkbox"
                      checked={
                        adminState.orders?.length > 0 &&
                        adminState.orders
                          ?.filter(
                            (order) => order.status === state.activeSection
                          )
                          ?.every((order) =>
                            state.selectedOrderIds.includes(order._id)
                          )
                      }
                      onChange={(e) =>
                        setState((state) => ({
                          ...state,
                          selectedOrderIds: !e.target.checked
                            ? []
                            : adminState.orders
                                .filter(
                                  (order) =>
                                    order.status === state.activeSection
                                )
                                ?.map((order) => order._id),
                        }))
                      }
                    />
                  </th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Reference</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Address</th>
                  <th className="text-left">Nb items</th>
                  <th className="text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {adminState.orders
                  ?.filter((order) => order.status === state.activeSection)
                  ?.map((order) => (
                    <TableItem
                      key={order._id}
                      order={order}
                      state={state}
                      setState={setState}
                    />
                  ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden grid gap-3 text-black mt-5">
            {adminState.orders
              ?.filter((order) => order.status === state.activeSection)
              ?.map((order) => (
                <Item
                  key={order._id}
                  order={order}
                  state={state}
                  setState={setState}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSection;

const ExpandedOrder = ({ order, setState }) => {
  const [adminState, setAdminState] = useAdminContext();
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString();
  const [, setGlobalState] = useGlobalContext();
  const changeStatus = (e) =>
    catchAsync(async () => {
      setLoading(true);
      const res = await Axios.patch(`orders/${order._id}`, { status });
      setLoading(false);
      setAdminState((state) => ({
        ...state,
        orders: adminState.orders.map((item) =>
          item._id === order._id ? res.data.order : item
        ),
      }));
      setLoading(false);
      setState((state) => ({
        ...state,
        expandedOrder: "",
      }));
      setGlobalState((state) => ({
        ...state,
        alert: {
          ...state.alert,
          show: true,
          type: SUCCESS,
          text: res.data.message,
          timeout: 3000,
        },
      }));
      setAdminState;
    }, setGlobalState);

  return (
    <div className="flex flex-col gap-3 bg-white p-2">
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold">Order</h2>
        <p>
          <span className="font-semibold"> Date</span>: {date}
        </p>
        <p>
          <span className="font-semibold"> Order Id</span>: {order._id}
        </p>
        <p>
          <span className="font-semibold"> Checkout Type</span>:{" "}
          {order.guestCheckout ? "Guest Checkout" : "Customer Checkout"}
        </p>
      </div>
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold">Customer</h2>
        {order.userId?.image && (
          <div className="flex items-center gap-2">
            <span className="font-semibold"> Photo:</span>{" "}
            <img
              src={order.userId.images[0]?.url}
              alt={order.userId.firstName}
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
        )}
        {order.userId && (
          <p>
            <span className="font-semibold">Name</span>:{" "}
            {order.userId?.firstName} {order.userId?.lastName}
          </p>
        )}
        <a href={`mailto:${order.contactEmail}`}>
          <span className="font-semibold"> Email:</span>: {order.contactEmail}
        </a>
      </div>
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold">Shipping Details</h2>
        <p>
          <span className="font-semibold"> First Name:</span>{" "}
          {order.shippingAddress.firstName}
        </p>
        <p>
          <span className="font-semibold"> Last Name:</span>{" "}
          {order.shippingAddress.lastName}
        </p>
        <p>
          <span className="font-semibold"> Address Line1:</span>{" "}
          {order.shippingAddress.addressLine1}
        </p>
        {order.shippingAddress.addressLine2 && (
          <p>
            <span className="font-semibold"> Address Line2:</span>{" "}
            {order.shippingAddress.addressLine2}
          </p>
        )}
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {order.shippingAddress.phone}
        </p>
        <p>
          <span className="font-semibold"> State:</span>{" "}
          {order.shippingAddress.stateOrProvince}
        </p>
        <p>
          <span className="font-semibold"> Zip:</span>{" "}
          {order.shippingAddress.zip}
        </p>
        <p>
          <span className="font-semibold"> Country:</span>{" "}
          {order.shippingAddress.country}
        </p>
      </div>
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold">Status</h2>
        <select
          className="max-w-max p-1 border border-gray-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value={ORDERED}>Ordered</option>
          <option value={PROCESSING}>Processing</option>
          <option value={DELIVERED}>Delivered</option>
          <option value={CANCELLED}>Cancelled</option>
        </select>
      </div>
      {order.customItems.length > 0 && (
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
                <span className="font-semibold">Note: </span> {item.note}
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
      {order.items.length > 0 && (
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
                  <tr className="border border-gray-300" key={item._id}>
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
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden grid gap-1">
            {order.items.map((item) => (
              <div
                className="grid gap-2 border border-gray-300 p-2"
                key={item._id}
              >
                <CustomLink
                  href={`shop/${item.product.category.slug}/${item.product.slug}`}
                >
                  <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.name}
                    className="h"
                  />
                </CustomLink>

                <p>
                  <span className="font-semibold">Name: </span>{" "}
                  {item.product.name}
                </p>
                <p>
                  <span className="font-semibold">Size: </span>{" "}
                  {item.selectedSize.info}
                </p>
                <p>
                  <span className="font-semibold">Color: </span>{" "}
                  {item.selectedColor.name}
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
      <div className="flex gap-2 justify-end">
        <LoadingBtn
          loading={loading}
          className=" py-1 px-4 bg-black text-white"
          onClick={changeStatus}
        >
          Save
        </LoadingBtn>
        <button
          className=" py-1 px-4 transition border border-gray-500 hover:bg-black hover:text-white"
          onClick={() => setState((state) => ({ ...state, expandedOrder: "" }))}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const TableItem = ({ order, state, setState }) => {
  const checked = state.selectedOrderIds.includes(order._id);
  const toggleCheck = () =>
    setState((state) => ({
      ...state,
      selectedOrderIds: checked
        ? state.selectedOrderIds?.filter((id) => id !== order._id)
        : [...state.selectedOrderIds, order._id],
    }));

  return (
    <tr className="border border-gray-300">
      <td className="pl-2 p-2">
        <input type="checkbox" checked={checked} onChange={toggleCheck} />
      </td>
      <td className="uppercase">{new Date(order.createdAt).toDateString()}</td>
      <td>{order._id}</td>
      <td>
        {order.userId ? (
          <div className="flex items-center gap-2">
            {order.userId?.image && (
              <img
                src={order.userId?.image?.url}
                alt={order.userId?.firstName}
                className="h-7 w-7 rounded-full object-cover"
              />
            )}
            <p className="text-purple-700">{order.userId?.firstName}</p>
          </div>
        ) : (
          "Guest"
        )}
      </td>
      <td>
        {order.shippingAddress.addressLine1},{" "}
        {order.shippingAddress.stateOrProvince} {order.shippingAddress.zip},{" "}
        {order.shippingAddress.country}
      </td>
      <td>{order.items.length + order.customItems.length}</td>
      <td className="font-semibold">${order.total}</td>
      <td>
        <button
          className=" rounded-full h-7 w-7 mx-2 flex items-center justify-center transition active:bg-gray-200 text-purple-600"
          onClick={() =>
            setState((state) => ({ ...state, expandedOrder: order }))
          }
        >
          <FaPencilAlt />
        </button>
      </td>
    </tr>
  );
};

const Item = ({ order, state, setState }) => {
  return (
    <div className="p-2 bg-white border">
      <div className="mt-2 mb-5 flex items-center justify-between ">
        <p className="">
          <span className="capitalize text-2xl">order</span>: {order._id}
        </p>
        <button
          className="text-2xl text-purple-500"
          onClick={() =>
            setState((state) => ({ ...state, expandedOrder: order }))
          }
        >
          <FaPencilAlt />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-lg">Customer:</p>
        {order.userId ? (
          <div className="flex items-center gap-1 text-purple-500">
            {order.userId?.image && (
              <img
                src={order.userId?.image?.url}
                alt={order.userId?.firstName}
                className=" rounded-full h-10 w-10 object-cover"
              />
            )}
            <p>{order.userId?.firstName}</p>
          </div>
        ) : (
          "Guest"
        )}
      </div>
      <p>
        <span className="text-lg">Date:</span>{" "}
        {new Date(order.createdAt).toDateString()}
      </p>
      <p>
        <span className="text-lg">Total:</span> $400
      </p>
      <p>
        <span className="text-lg">Status:</span>{" "}
        <span className="lowercase">{order.status}</span>
      </p>
    </div>
  );
};

const SearchBar = () => {
  const [, setGlobalState] = useGlobalContext();
  const [, setState] = useAdminContext();
  const CUSTOMER_ID = "CUSTOMER_ID";
  const ORDER_ID = "ORDER_ID";
  const CUSTOMER_NAME = "CUSTOMER_NAME";
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    searchBy: ORDER_ID,
    searchText: "",
    passedSince: "",
    passedBefore: "",
  });

  const search = () =>
    catchAsync(
      async () => {
        setLoading(true);

        const searchBy = filter.searchText
          ? filter.searchBy === ORDER_ID
            ? "id="
            : filter.searchBy === CUSTOMER_ID
            ? "customer_id="
            : filter.searchBy === CUSTOMER_NAME
            ? "customer_name="
            : ""
          : "";

        const text = filter.searchText ? filter.searchText : "";

        const timeRange =
          `${
            filter.passedSince
              ? `&from=${new Date(filter.passedSince).getTime()}`
              : ""
          }` +
          `${
            filter.passedBefore
              ? `&till=${new Date(filter.passedBefore).getTime()}`
              : ""
          }`;

        const queryString = `orders?${searchBy}${text}${timeRange}`;

        const res = await Axios.get(queryString);

        setLoading(false);
        setState((state) => ({ ...state, orders: res.data.orders || [] }));
      },
      setGlobalState,
      () => setLoading(false)
    );

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-1">
        <p className="capitalize">search text</p>
        <input
          type="text"
          placeholder="Search Order"
          className="p-2  rounded border max-w-max"
          vaue={filter.searchText}
          onChange={(e) => {
            setFilter((filter) => ({ ...filter, searchText: e.target.value }));
          }}
        />
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="capitalize">search by</p>
          <select
            className="bg-gray-100 p-2 bg-white border"
            value={filter.searchBy}
            onChange={(e) =>
              setFilter((filter) => ({ ...filter, searchBy: e.target.value }))
            }
          >
            <option value={ORDER_ID}>Order Id</option>
            <option value={CUSTOMER_ID}>Customer Id</option>
            <option value={CUSTOMER_NAME}>Customer Name</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <p className="capitalize">passed before</p>
          <input
            type="datetime-local"
            className="p-2 border"
            value={filter.passedBefore}
            onChange={(e) =>
              setFilter((filter) => ({
                ...filter,
                passedBefore: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="capitalize">passed since</p>
          <input
            type="datetime-local"
            className="p-2 border"
            value={filter.passedSince}
            onChange={(e) =>
              setFilter((filter) => ({
                ...filter,
                passedSince: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <LoadingBtn
        className="py-1 px-3 bg-gray-200 max-w-max"
        loading={loading}
        borderColor="border-black"
        onClick={search}
      >
        search
        {!loading && <FaSearch />}
      </LoadingBtn>
    </div>
  );
};
