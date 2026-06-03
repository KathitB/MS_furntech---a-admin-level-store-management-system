import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar, { menuItems } from "./SideBar";
import DashBoard from "./pages/DashBoard";
import Orders from "./pages/Orders";
import CashBack from "./pages/CashBack";
import Team from "./pages/Team";
import OfferBanner from "./pages/OfferBanner";
import OrderDetails from "./pages/OrderDetails";
import "./PageShell.scss";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Categories from "./pages/Categories";
import Notifications from "./pages/Notifications";
import AddProductPage from "./pages/AddProductPage";

const searchableData = {
  dashboard: [
    "Net revenue",
    "Orders placed",
    "Active customers",
    "Cashback issued",
  ],
  orders: [
    "Order #MS-1042",
    "Dining table order",
    "Mumbai delivery",
    "Pending invoice",
  ],
  cashback: [
    "Welcome reward",
    "Festive cashback",
    "Pending credit",
    "Redeemed offer",
  ],
  "offer-banners": [
    "Summer sale banner",
    "Sofa discount hero",
    "New arrivals strip",
  ],
  team: ["Meera Suresh", "Sales manager", "Catalog executive", "Support lead"],
  customers: [
    "Aarav Shah",
    "Priya Mehta",
    "Rahul Nair",
    "Mumbai premium customers",
  ],
  categories: [
    "Living Room",
    "Bedroom",
    "Dining & Kitchen",
    "Home Office",
    "Outdoor & Patio",
    "Mid-Century Modern",
    "Hardwood",
    "Sale & Clearance",
  ],
  products: [
    "Luna Sofa",
    "Aster Dining Table",
    "Mira Chair",
    "Decor SKU MS-221",
  ],
  analytics: [
    "Revenue trend",
    "Customer retention",
    "Category mix",
    "Conversion report",
  ],
  "mobile-app": [
    "App installs",
    "Push campaigns",
    "Release 2.4",
    "Mobile checkout",
  ],
  notifications: [
    "App notification",
    "Home Page",
    "Checkout",
    "Scheduled",
    "Sent",
  ],
};

// const formatDate = () =>
//   new Date().toLocaleDateString("en-GB", {
//     weekday: "long",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

const PageShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productsItem = menuItems.find((item) => item.id === "products");
  const isAddProductPage = location.pathname === "/dashboard/products/add";
  const productEditMatch = location.pathname.match(
    /^\/dashboard\/products\/([^/]+)\/edit$/,
  );
  const editingProductId = productEditMatch?.[1] || "";
  const isProductFormPage = isAddProductPage || Boolean(editingProductId);
  const [activeItem, setActiveItem] = useState(
    isProductFormPage && productsItem ? productsItem : menuItems[0],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const currentItem =
    isProductFormPage && productsItem ? productsItem : activeItem;
  const headerBanner = selectedOrderId
    ? "ORDER MANAGEMENT"
    : isProductFormPage
      ? "PRODUCT MANAGEMENT"
      : currentItem.banner;
  const headerTitle = selectedOrderId
    ? "Order Details"
    : isAddProductPage
      ? "Add Product"
      : editingProductId
        ? "Update Product"
      : currentItem.header;
  const searchPlaceholder = selectedOrderId
    ? "Search order details"
    : `Search ${currentItem.label.toLowerCase()}`;

  const filteredResults = useMemo(() => {
    const currentItems = searchableData[currentItem.id] || [];
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return currentItems;
    }

    return currentItems.filter((item) => item.toLowerCase().includes(query));
  }, [currentItem.id, searchTerm]);

  const handleMenuChange = (item) => {
    navigate("/dashboard");
    setActiveItem(item);
    setSearchTerm("");
    setSelectedOrderId(null);
  };

  const handleOrderSelect = (order) => {
    const ordersItem = menuItems.find((item) => item.id === "orders");

    if (ordersItem) {
      setActiveItem(ordersItem);
    }

    setSearchTerm("");
    setSelectedOrderId(order.orderId || order.order || "MS-10247");
  };

  const handleCustomerSelect = () => {
    const customerItem = menuItems.find((item) => item.id === "customers");

    if (customerItem) {
      setActiveItem(customerItem);
    }

    setSearchTerm("");
  };

  const handleBackToOrders = () => {
    const ordersItem = menuItems.find((item) => item.id === "orders");

    if (ordersItem) {
      setActiveItem(ordersItem);
    }

    setSelectedOrderId(null);
  };

  const handleBackToProducts = () => {
    if (productsItem) {
      setActiveItem(productsItem);
    }

    setSearchTerm("");
    setSelectedOrderId(null);
    navigate("/dashboard");
  };

  const renderSelectedPage = () => {
    if (isProductFormPage) {
      return (
        <AddProductPage
          productId={editingProductId}
          initialProduct={location.state?.product}
          onBack={handleBackToProducts}
        />
      );
    }

    if (selectedOrderId) {
      return (
        <OrderDetails orderId={selectedOrderId} onBack={handleBackToOrders} />
      );
    }

    if (activeItem.id === "dashboard") {
      return <DashBoard onOrderSelect={handleOrderSelect} />;
    }

    if (activeItem.id === "orders") {
      return (
        <Orders searchTerm={searchTerm} onOrderSelect={handleOrderSelect} />
      );
    }

    if (activeItem.id === "cashback") {
      return <CashBack searchTerm={searchTerm} />;
    }

    if (activeItem.id === "team") {
      return <Team searchTerm={searchTerm} />;
    }

    if (activeItem.id === "offer-banners") {
      return <OfferBanner searchTerm={searchTerm} />;
    }

    if (activeItem.id === "customers") {
      return (
        <Customers
          searchTerm={searchTerm}
          onCustomerSelect={handleCustomerSelect}
        />
      );
    }
    if (activeItem.id === "products") {
      return <Products searchTerm={searchTerm} />;
    }

    if (activeItem.id === "categories") {
      return <Categories searchTerm={searchTerm} />;
    }

    if (activeItem.id === "analytics") {
      return <Analytics searchTerm={searchTerm} />;
    }

    if (activeItem.id === "mobile-app") {
      return <DashBoard onOrderSelect={handleOrderSelect} />;
    }

    if (activeItem.id === "notifications") {
      return <Notifications searchTerm={searchTerm} />;
    }

    return (
      <section className="page-shell__panel">
        <div>
          <p className="page-shell__eyebrow">{activeItem.label}</p>
          <h2>
            {searchTerm ? "Search results" : `${activeItem.label} overview`}
          </h2>
        </div>

        {filteredResults.length > 0 ? (
          <div className="page-shell__results">
            {filteredResults.map((result) => (
              <button className="page-shell__result" type="button" key={result}>
                <span>{result}</span>
                <small>Open</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="page-shell__empty">
            No results found for "{searchTerm}" in {activeItem.label}.
          </p>
        )}
      </section>
    );
  };

  return (
    <div className="page-shell">
      <SideBar activeItemId={currentItem.id} onMenuChange={handleMenuChange} />

      <div className="page-shell__main">
        <header className="page-shell__header">
          <div className="page-shell__header-left">
            {/* <p className="page-shell__date">{formatDate()} - MUMBAI HQ</p> */}
            <p className="page-shell__date">{headerBanner}</p>
            <h1 className="page-shell__title">{headerTitle}</h1>
            {/* <p className="page-shell__subtitle">{activeItem.subheader}</p> */}
          </div>

          <div className="page-shell__header-right">
            <label className="page-shell__search">
              <span className="page-shell__search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M16.5 16.5L21 21" />
                </svg>
              </span>
              <input
                type="search"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <button
              className="page-shell__notification"
              type="button"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>
            </button>
          </div>
        </header>

        <main className="page-shell__content">{renderSelectedPage()}</main>
      </div>
    </div>
  );
};

export default PageShell;
