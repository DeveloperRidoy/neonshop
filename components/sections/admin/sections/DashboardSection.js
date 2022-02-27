import { BsCurrencyDollar } from "react-icons/bs"
import { FaBox,  FaShoppingCart } from "react-icons/fa"
import { ORDERS,  PRODUCTS, useAdminContext } from '../../../../pages/admin';


const DashboardSection = () => {
  const [adminState] = useAdminContext();
  let pendingOrdersCount = 0
  if (adminState.orders?.length > 0) {
    adminState.orders.forEach(order => {
      if (order.status === 'ORDERED' || order.status === 'PROCESSING') pendingOrdersCount += 1;
    })
  }
    return (
      <div className="py-10 px-5 lg:px-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10  w-full">
          <Item text="pending orders" value={pendingOrdersCount} section={ORDERS}>
            <FaShoppingCart/>
          </Item>
          <Item text="total products" value={adminState.numOfProducts} section={PRODUCTS}>
            <FaBox/>
          </Item>
          
        </div>
      </div>
    );
}

export default DashboardSection



const Item = ({ text,value, children, showIcon, section }) => {
  const [, setState] = useAdminContext();
  return (
    <button
      className="flex justify-between text-white bg-gray-800 rounded overflow-hidden border"
      onClick={() => setState(state => ({ ...state, activeSection: section }))}  
      title={text}
    > 
        <div className="p-5 bg-gray-600 text-gray-50 flex items-center justify-center text-2xl md:text-3xl h-full">
          {children}
        </div>
        <div className="flex flex-col justify-center items-end h-full p-2">
          <p className="capitalize text-lg md:text-xl text-gray-400 ">{text}</p>
          <div className="flex items-center text-lg md:text-2xl">
            {showIcon && <BsCurrencyDollar />}
            <span>{value}</span>
          </div>
        </div>
      </button>
    );
}