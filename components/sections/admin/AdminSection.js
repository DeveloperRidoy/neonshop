import dynamic from "next/dynamic";
import { ADD_NEW_PRODUCT, CATEGORIES, CUSTOMERS, DASHBOARD, ORDERS, PRODUCTS, REVIEWS, useAdminContext } from "../../../pages/admin";
import AdminHeader from "./AdminHeader"
import Sidebar from "./Sidebar"


const DashboardSection = dynamic(() => import('./sections/DashboardSection'));
const OrderSection = dynamic(() => import('./sections/OrderSection'));
const ProductSection = dynamic(() => import('./sections/ProductsSection/ProductSection'));
const AddNewProductSection = dynamic(() => import('./sections/AddNewProductSection'));
const CategorySection = dynamic(() => import('./sections/CategorySection'));
const AdminSection = () => {
    const [state] = useAdminContext();
    return (
      <div className="flex flex-col  min-h-screen bg-[#f1f2f6]">
        <AdminHeader />
        <div className="flex-1 flex gap-2">
          <Sidebar />
          {state.activeSection === DASHBOARD ? (
            <DashboardSection />
          ) : state.activeSection === ORDERS ? (
            <OrderSection/>
          ) : state.activeSection === PRODUCTS ? (
            <ProductSection />
          ) : state.activeSection === ADD_NEW_PRODUCT ? (
            <AddNewProductSection />
          ) : (
            state.activeSection === CATEGORIES && <CategorySection />
          )}
        </div>
      </div>
    );
}

export default AdminSection
