import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import ReactTable from "../ui/ReactTable";
import "./Customers.scss";
import AddCustomerModal from "./AddCustomerModal";
import { apiRequest } from "../api/api";
import editIcon from "../../assets/edit-pen-2-svgrepo-com.svg";
import deleteIcon from "../../assets/delete-2-svgrepo-com (1).svg";
import { toast } from "react-toastify";

export const metricCards = [
  {
    // id: "totalCustomers",
    title: "Total",
    value: 3941,
    valueFormatted: "3,941",
    subtitle: null,
  },
  {
    // id: "platinumCustomers",
    title: "Platinum Tier",
    value: 218,
    valueFormatted: "218",
    subtitle: null,
  },
  {
    // id: "avgLTV",
    title: "Avg LTV",
    value: 124800,
    valueFormatted: "₹1,24,800",
    subtitle: null,
  },
  {
    // id: "repeatRate",
    title: "Repeat Rate",
    value: 42,
    valueFormatted: "42%",
    subtitle: null,
  },
];

export const customerLTVDetails = [
  {
    id: "CUST-001",
    initials: "AK",
    name: "Aanya Kapoor",
    email: "aanya.k@mail.com",
    city: "Mumbai",
    orders: 9,
    ltv: 412300,
    ltvFormatted: "₹4,12,300",
    cashback: 8240,
    cashbackFormatted: "₹8,240",
    tier: "Platinum",
    joined: "Aug 2022",
  },
  {
    id: "CUST-002",
    initials: "RM",
    name: "Rohan Mehta",
    email: "rohan.m@mail.com",
    city: "Bangalore",
    orders: 6,
    ltv: 248600,
    ltvFormatted: "₹2,48,600",
    cashback: 4970,
    cashbackFormatted: "₹4,970",
    tier: "Gold",
    joined: "Mar 2023",
  },
  {
    id: "CUST-003",
    initials: "IV",
    name: "Ishita Verma",
    email: "ishita.v@mail.com",
    city: "Delhi",
    orders: 12,
    ltv: 528100,
    ltvFormatted: "₹5,28,100",
    cashback: 10560,
    cashbackFormatted: "₹10,560",
    tier: "Platinum",
    joined: "Jan 2022",
  },
  {
    id: "CUST-004",
    initials: "KS",
    name: "Karan Shah",
    email: "karan.s@mail.com",
    city: "Pune",
    orders: 4,
    ltv: 178400,
    ltvFormatted: "₹1,78,400",
    cashback: 3568,
    cashbackFormatted: "₹3,568",
    tier: "Silver",
    joined: "Sep 2024",
  },
  {
    id: "CUST-005",
    initials: "NI",
    name: "Neha Iyer",
    email: "neha.i@mail.com",
    city: "Chennai",
    orders: 3,
    ltv: 89200,
    ltvFormatted: "₹89,200",
    cashback: 1784,
    cashbackFormatted: "₹1,784",
    tier: "Silver",
    joined: "Feb 2025",
  },
];

// const formatCustomers = (customer) => ({
//   id: customer?._id || customer?.id,
//   name: customer?.firstName || "",
//   // description: customer?.description || "",
//   // status: customer?.status !== false,
//   createdAt: customer?.createdAt || new Date().toISOString(),
// });

const formatCustomer = (customer) => ({
  id: customer?._id || customer?.id,
  firstName: customer?.firstName || "",
  lastName: customer?.lastName || "",
  email: customer?.email || "",
  mobileNumber: customer?.mobileNumber || "",
  profilePicture: customer?.profilePicture || "",
  address: customer?.address || "",
  city: customer?.city || "",
  state: customer?.state || "",
  postalCode: customer?.postalCode || "",
  country: customer?.country || "",
  is_deleted: customer?.is_deleted || false,
  createdAt: customer?.createdAt || new Date().toISOString(),
  updatedAt: customer?.updatedAt || new Date().toISOString(),
});

const createFallbackCustomerId = () =>
  globalThis.crypto?.randomUUID?.() || `customer-${Date.now()}`;

const getResponseCustomer = (response, fallback) =>
  response?.data?.category || response?.data || response?.category || fallback;

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Customers = ({ searchTerm = "", onCustomerSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  // const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // const filteredCustomers = useMemo(() => {
  //   // const [modalOpen, setModalOpen] = useState(false);
  //   // const [modalMode, setModalMode] = useState("create");

  //   const query = searchTerm.trim().toLowerCase();

  //   return customerLTVDetails.filter((customer) => {
  //     //   const matchesStatus =
  //     //     activeStatus === "All" || customer.status === activeStatus;

  //     const matchesSearch =
  //       !query ||
  //       [
  //         customer.id,
  //         customer.name,
  //         customer.email,
  //         customer.city,
  //         customer.orders,
  //         customer.ltv,
  //         customer.cashback,
  //         customer.tier,
  //         customer.joined,
  //       ].some((value) => String(value).toLowerCase().includes(query));

  //     return matchesSearch;
  //   });
  // }, [searchTerm]);

  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: "orderId",
  //       header: "ORDER ID",
  //       cell: ({ getValue }) => (
  //         <strong className="orders-table__id">{getValue()}</strong>
  //       ),
  //     },
  //     {
  //       accessorKey: "customerName",
  //       header: "CUSTOMER",
  //       cell: ({ row }) => (
  //         <div className="orders-table__customer">
  //           <strong>{row.original.customerName}</strong>
  //           <span>{row.original.city}</span>
  //         </div>
  //       ),
  //     },
  //     {
  //       accessorKey: "orderDate",
  //       header: "DATE",
  //     },
  //     {
  //       accessorKey: "items",
  //       header: "ITEMS",
  //     },
  //     {
  //       accessorKey: "amount",
  //       header: "AMOUNT",
  //       cell: ({ getValue }) => <span>{formatAmount(getValue())}</span>,
  //     },
  //     {
  //       accessorKey: "paymentMethod",
  //       header: "PAYMENT",
  //       cell: ({ getValue }) => {
  //         const payment = getValue();
  //         const className = payment.toLowerCase();

  //         return (
  //           <span className={`payment-pill payment-pill--${className}`}>
  //             {payment}
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       accessorKey: "status",
  //       header: "STATUS",
  //       cell: ({ getValue }) => {
  //         const status = getValue();
  //         const className = status.toLowerCase().replace(" ", "-");

  //         return (
  //           <span className={`status-pill status-pill--${className}`}>
  //             {status}
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       id: "open",
  //       header: "",
  //       cell: () => <span className="orders-table__arrow">&gt;</span>,
  //     },
  //   ],
  //   [],
  // );

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiRequest("/api/customer-detail/all");

        const formatted = (response.data || []).map(formatCustomer);
        console.log("formatted", formatted);

        setCustomers(formatted);
      } catch (err) {
        console.error(err);
        // setError("Failed to load customers. Please try again.");
        toast.error("Failed to load customers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: "name",
  //       header: "CUSTOMER",
  //       cell: ({ row }) => (
  //         <div className="customers-table__customer">
  //           <div className="customers-table__avatar">
  //             {row.original.initials}
  //           </div>

  //           <div className="customers-table__customer-info">
  //             <strong>{row.original.name}</strong>
  //             <span>{row.original.email}</span>
  //           </div>
  //         </div>
  //       ),
  //     },
  //     {
  //       accessorKey: "city",
  //       header: "CITY",
  //     },
  //     {
  //       accessorKey: "orders",
  //       header: "ORDERS",
  //       cell: ({ getValue }) => (
  //         <span className="customers-table__orders">{getValue()}</span>
  //       ),
  //     },
  //     {
  //       accessorKey: "ltv",
  //       header: "LTV",
  //       cell: ({ getValue }) => (
  //         <strong className="customers-table__amount">
  //           {formatAmount(getValue())}
  //         </strong>
  //       ),
  //     },
  //     {
  //       accessorKey: "cashback",
  //       header: "CASHBACK",
  //       cell: ({ getValue }) => (
  //         <span className="customers-table__cashback">
  //           {formatAmount(getValue())}
  //         </span>
  //       ),
  //     },
  //     {
  //       accessorKey: "tier",
  //       header: "TIER",
  //       cell: ({ getValue }) => {
  //         const tier = getValue();
  //         const className = tier.toLowerCase();

  //         return (
  //           <span className={`tier-pill tier-pill--${className}`}>{tier}</span>
  //         );
  //       },
  //     },
  //     {
  //       accessorKey: "joined",
  //       header: "JOINED",
  //     },
  //     {
  //       id: "open",
  //       header: "",
  //       cell: () => <span className="customers-table__arrow">&gt;</span>,
  //     },
  //   ],
  //   [],
  // );

  const columns = useMemo(
    () => [
      {
        id: "serialNumber",
        header: "SR.NO",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "firstName",
        header: "CUSTOMER",
        cell: ({ row }) => (
          <div className="customers-table__customer">
            <div className="customers-table__avatar">
              {`${row.original.firstName?.[0] || ""}${
                row.original.lastName?.[0] || ""
              }`}
            </div>

            <div className="customers-table__customer-info">
              <strong>
                {row.original.firstName} {row.original.lastName}
              </strong>
              <span>{row.original.email}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "mobileNumber",
        header: "MOBILE",
      },
      {
        accessorKey: "city",
        header: "CITY",
      },
      {
        accessorKey: "state",
        header: "STATE",
      },
      {
        accessorKey: "country",
        header: "COUNTRY",
      },
      {
        accessorKey: "createdAt",
        header: "CREATED",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="team-actions">
            <button
              className="team-actions__button"
              type="button"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => openEditModal(row.original)}
            >
              <img src={editIcon} alt="" />
            </button>
            <button
              className="team-actions__button team-actions__button--delete"
              type="button"
              aria-label={`Delete ${row.original.name}`}
              onClick={() => setCustomerToDelete(row.original)}
            >
              <img src={deleteIcon} alt="" />
            </button>
          </div>
        ),
      },
      {
        id: "open",
        header: "",
        cell: () => <span className="customers-table__arrow">&gt;</span>,
      },
    ],
    [],
  );
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setModalMode("update");
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
    setModalMode("create");
  };

  const handleCreateCustomer = async (payload) => {
    console.log("Payload being sent:", payload);
    try {
      const response = await apiRequest("/api/customer-detail/create", {
        method: "POST",
        body: JSON.stringify(payload),
        // body: payload,
      });
      const createdCustomer = formatCustomer(
        getResponseCustomer(response, {
          ...payload,
          _id: createFallbackCustomerId(),
          createdAt: new Date().toISOString(),
        }),
      );

      setCustomers((prev) => [...prev, createdCustomer]);
      handleCloseModal();
      // toast.error("Customer created successfully");
      toast.success("Customer created successfully");
    } catch (err) {
      console.error("Failed to create customer:", err);
      toast.error(err.message || "Failed to create customer");
      throw err;
    }
  };

  const handleUpdateCustomer = async (payload) => {
    if (!selectedCustomer) return;

    console.log("UPDATE CLICKED");
    console.log("selectedCustomer", selectedCustomer);
    console.log("payload", payload);

    try {
      const response = await apiRequest(
        `/api/customer-detail/${selectedCustomer.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );
      const updatedCustomer = formatCustomer(
        getResponseCustomer(response, {
          ...selectedCustomer,
          ...payload,
          _id: selectedCustomer.id,
        }),
      );

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === selectedCustomer.id ? updatedCustomer : customer,
        ),
      );
      handleCloseModal();
      toast.success("Customer updated successfully");
    } catch (err) {
      console.error("Failed to update customer:", err);
      toast.error(err.message || "Failed to update customer");
      throw err;
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    setDeleteLoading(true);

    try {
      await apiRequest(`/api/customer-detail/${customerToDelete.id}`, {
        method: "DELETE",
      });

      setCustomers((prev) =>
        prev.filter((customer) => customer.id !== customerToDelete.id),
      );
      setCustomerToDelete(null);
      toast.success("Customer deleted successfully");
    } catch (err) {
      console.error("Failed to delete customer:", err);
      toast.error(err.message || "Failed to delete customer");
    } finally {
      setDeleteLoading(false);
    }
  };

  const query = searchTerm.trim().toLowerCase();

  const visibleCustomers = useMemo(() => {
    return customers.filter((customer) => {
      return query
        ? normalize(`${customer.firstName} ${customer.lastName}`).includes(
            query,
          ) ||
            normalize(customer.email || "").includes(query) ||
            normalize(String(customer.mobileNumber || "")).includes(query) ||
            normalize(customer.address || "").includes(query) ||
            normalize(customer.city || "").includes(query) ||
            normalize(customer.state || "").includes(query) ||
            normalize(customer.country || "").includes(query)
        : true;
    });
  }, [customers, query]);

  console.log("customers length:", customers.length);
  console.log("customers data:", customers);

  return (
    <div className="customers-page">
      <div className="categories-toolbar">
        <div>
          {/* <p>Primary navigation, filters, materials, and catalog campaigns.</p>ss */}
          {/* <strong>
            {loading ? "Loading..." : `${activeCount} categories`}
          </strong> */}
        </div>
        <button type="button" onClick={openCreateModal}>
          <span>+</span>
          Add Customer
        </button>
      </div>
      <section className="customer-metrics">
        {metricCards.map((card) => (
          <article className="customer-metric-card" key={card.title}>
            <div className="metric-card__topline">{card.title}</div>
            <div className="metric-card__value-row">
              <h3>
                {/* {card.prefix && <span>&#8377; </span>}
                {card.value} */}
                {card.valueFormatted}
              </h3>
              {/* <span
                className={`metric-card__change metric-card__change--${card.trend}`}
              >
                {card.trend === "up" ? "Up" : "Down"} {card.change}
              </span> */}
            </div>
          </article>
        ))}
      </section>
      {/* <div className="customers-grid"></div> */}

      <div>Customers loaded: {customers.length}</div>
      <div className="customers-card">
        <ReactTable
          className="customers-table"
          // data={visibleCustomers}
          data={customers}
          columns={columns}
          emptyMessage="No orders found."
          getRowId={(row) => row.id}
          onRowClick={onCustomerSelect}
        />
      </div>

      <AddCustomerModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={
          modalMode === "update" ? handleUpdateCustomer : handleCreateCustomer
        }
        mode={modalMode}
        customer={selectedCustomer}
      />

      {customerToDelete && (
        <div className="team-delete-overlay" role="dialog" aria-modal="true">
          <div className="team-delete-modal">
            <h3>Delete customer?</h3>
            <p>
              Are you sure you want to delete
              <strong> {customerToDelete.name}</strong>?
            </p>
            <div className="team-delete-modal__actions">
              <button
                className="team-delete-modal__cancel"
                type="button"
                onClick={() => setCustomerToDelete(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="team-delete-modal__delete"
                type="button"
                onClick={handleDeleteCustomer}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
