import { useState } from "react";
import "./SideBar.scss";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const icons = {
  dashboard: (
    <svg {...iconProps}>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </svg>
  ),
  orders: (
    <svg {...iconProps}>
      <path d="M7 7h10" />
      <path d="M7 12h10" />
      <path d="M7 17h6" />
      <rect x="4" y="3" width="16" height="18" rx="2" />
    </svg>
  ),
  cashback: (
    <svg {...iconProps}>
      <path d="M6 8h12" />
      <path d="M8 12h8" />
      <path d="M9 16h6" />
      <rect x="3" y="6" width="18" height="12" rx="2" />
    </svg>
  ),
  "offer-banners": (
    <svg {...iconProps}>
      <path d="M4 14l13-5v10L4 14z" />
      <path d="M17 11h3" />
      <path d="M8 15l1 4" />
    </svg>
  ),
  team: (
    <svg {...iconProps}>
      <path d="M16 19v-1a4 4 0 0 0-8 0v1" />
      <circle cx="12" cy="8" r="3" />
      <path d="M20 19v-1a3 3 0 0 0-3-3" />
      <path d="M4 19v-1a3 3 0 0 1 3-3" />
    </svg>
  ),
  customers: (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20a6 6 0 0 1 12 0" />
      <rect x="4" y="3" width="16" height="18" rx="2" />
    </svg>
  ),
  categories: (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20a6 6 0 0 1 12 0" />
      <rect x="4" y="3" width="16" height="18" rx="2" />
    </svg>
  ),
  products: (
    <svg {...iconProps}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5" />
      <path d="M12 12v9" />
      <path d="M12 12L4 7.5" />
    </svg>
  ),
  analytics: (
    <svg {...iconProps}>
      <path d="M4 19h16" />
      <path d="M7 16V8" />
      <path d="M12 16V5" />
      <path d="M17 16v-6" />
    </svg>
  ),
  "mobile-app": (
    <svg {...iconProps}>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 17h2" />
    </svg>
  ),
  notifications: (
    <svg {...iconProps}>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 17h2" />
    </svg>
  ),
};

const formatDate = () =>
  new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    banner: `${formatDate()} - MUMBAI HQ`,
    header: "Good morning, Meera",
    subheader: "Today's business pulse across revenue, orders, and customers.",
  },
  {
    id: "orders",
    label: "Orders",
    banner: " All orders -1284 records",
    header: "Orders",
    subheader: "Track live order activity, fulfillment, and customer requests.",
  },
  {
    id: "cashback",
    label: "Cashback",
    banner: " LOYALTY ENGINE- MS CASHBACK",
    header: "Cashback",
    subheader: "Review issued rewards, pending credits, and campaign impact.",
  },
  {
    id: "offer-banners",
    label: "Offer Banners",
    banner: "3 BANNER SCHEDULED - 2 LIVE",
    header: "Offer Banners",
    subheader: "Manage promotional placements across the shopping journey.",
  },
  {
    id: "team",
    label: "Team",
    banner: "INTERNAL ACCESS - 5 MEMBERS",
    header: "Team",
    subheader: "Coordinate roles, access, and operational ownership.",
  },
  {
    id: "customers",
    label: "Customers",
    banner: "3,941 customers · 218 Platinum",
    header: "Customers",
    subheader: "Search customer profiles, segments, and purchase history.",
  },

  {
    id: "categories",
    label: "Categories",
    banner: "Catalog taxonomy - Rooms, filters, and collections",
    header: "Categories",
    subheader:
      "Manage room navigation, product filters, materials, and app collections.",
  },
  {
    id: "products",
    label: "Products",
    banner: "Catalog · 5 SKUs",
    header: "Products",
    subheader: "Maintain product catalog, inventory, and SKU performance.",
  },
  {
    id: "analytics",
    label: "Analytics",
    banner: " Last 12 months · live",
    header: "Analytics",
    subheader: "Explore performance trends and channel-level insights.",
  },
  {
    id: "mobile-app",
    label: "Mobile App",
    banner: " iOS · Customer experience · 5 screens",
    header: "Mobile App",
    subheader: "Monitor app engagement, releases, and customer experience.",
  },
  {
    id: "notifications",
    label: "Notifications",
    banner: "App Notifications",
    header: "Notifications",
    subheader: "Monitor app engagement, releases, and customer experience.",
  },
  //   {
  //     id: "order-details",
  //     label: "Order Details",
  //     banner: "Order MS-10247 · In Transit",
  //     header: "Order Details",
  //   },
];

const SideBar = ({ activeItemId, onMenuChange }) => {
  const [viewMode, setViewMode] = useState("admin");

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h2>
          <span className="sidebar__brand-primary">MS</span>{" "}
          <span className="sidebar__brand-secondary">Furntech</span>
        </h2>
        <p>EST. 2014</p>
      </div>

      <div className="sidebar__section-title">ADMIN CONSOLE</div>

      <nav className="sidebar__nav" aria-label="Admin navigation">
        {menuItems.map((item) => {
          const isActive = activeItemId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar__nav-item ${
                isActive ? "sidebar__nav-item--active" : ""
              }`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onMenuChange(item)}
            >
              <span className="sidebar__icon">{icons[item.id]}</span>
              <span className="sidebar__label">{item.label}</span>
              {isActive && <span className="sidebar__arrow">&gt;</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar__switch">
        <p>SWITCH VIEW</p>
        <div className="sidebar__switch-buttons">
          <button
            type="button"
            className={viewMode === "admin" ? "active" : ""}
            onClick={() => setViewMode("admin")}
          >
            Admin
          </button>
          <button
            type="button"
            className={viewMode === "customer" ? "active" : ""}
            onClick={() => setViewMode("customer")}
          >
            Manager
          </button>
        </div>
      </div>

      <div className="sidebar__user">
        <div className="sidebar__avatar">MS</div>
        <div>
          <h4>Meera Suresh</h4>
          <p>Founder</p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
