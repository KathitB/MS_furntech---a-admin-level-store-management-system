import React, { useMemo, useState } from "react";
import ReactTable from "../ui/ReactTable";
import "./Orders.scss";

export const customerDetails = [
  {
    orderId: "MS-10247",
    customerName: "Aanya Kapoor",
    city: "Mumbai",
    orderDate: "12 Jan 2026",
    items: 3,
    amount: 82400,
    paymentMethod: "Card",
    status: "In Transit",
  },
  {
    orderId: "MS-10246",
    customerName: "Rohan Mehta",
    city: "Bangalore",
    orderDate: "12 Jan 2026",
    items: 1,
    amount: 42500,
    paymentMethod: "UPI",
    status: "Processing",
  },
  {
    orderId: "MS-10245",
    customerName: "Ishita Verma",
    city: "Delhi",
    orderDate: "11 Jan 2026",
    items: 2,
    amount: 64200,
    paymentMethod: "Card",
    status: "Delivered",
  },
  {
    orderId: "MS-10244",
    customerName: "Karan Shah",
    city: "Pune",
    orderDate: "11 Jan 2026",
    items: 4,
    amount: 128900,
    paymentMethod: "EMI",
    status: "Delivered",
  },
  {
    orderId: "MS-10243",
    customerName: "Neha Iyer",
    city: "Chennai",
    orderDate: "10 Jan 2026",
    items: 1,
    amount: 32400,
    paymentMethod: "UPI",
    status: "Cancelled",
  },
  {
    orderId: "MS-10242",
    customerName: "Vikram Bose",
    city: "Kolkata",
    orderDate: "10 Jan 2026",
    items: 2,
    amount: 78900,
    paymentMethod: "Card",
    status: "Delivered",
  },
  {
    orderId: "MS-10241",
    customerName: "Priya Nair",
    city: "Kochi",
    orderDate: "09 Jan 2026",
    items: 1,
    amount: 5400,
    paymentMethod: "UPI",
    status: "Delivered",
  },
];

const orderTabs = ["All", "Processing", "In Transit", "Delivered", "Cancelled"];

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Orders = ({ searchTerm = "", onOrderSelect }) => {
  const [activeStatus, setActiveStatus] = useState("All");

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return customerDetails.filter((order) => {
      const matchesStatus =
        activeStatus === "All" || order.status === activeStatus;

      const matchesSearch =
        !query ||
        [
          order.orderId,
          order.customerName,
          order.city,
          order.orderDate,
          order.paymentMethod,
          order.status,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, searchTerm]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "orderId",
        header: "ORDER ID",
        cell: ({ getValue }) => (
          <strong className="orders-table__id">{getValue()}</strong>
        ),
      },
      {
        accessorKey: "customerName",
        header: "CUSTOMER",
        cell: ({ row }) => (
          <div className="orders-table__customer">
            <strong>{row.original.customerName}</strong>
            <span>{row.original.city}</span>
          </div>
        ),
      },
      {
        accessorKey: "orderDate",
        header: "DATE",
      },
      {
        accessorKey: "items",
        header: "ITEMS",
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ getValue }) => <span>{formatAmount(getValue())}</span>,
      },
      {
        accessorKey: "paymentMethod",
        header: "PAYMENT",
        cell: ({ getValue }) => {
          const payment = getValue();
          const className = payment.toLowerCase();

          return (
            <span className={`payment-pill payment-pill--${className}`}>
              {payment}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ getValue }) => {
          const status = getValue();
          const className = status.toLowerCase().replace(" ", "-");

          return (
            <span className={`status-pill status-pill--${className}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: "open",
        header: "",
        cell: () => <span className="orders-table__arrow">&gt;</span>,
      },
    ],
    [],
  );

  return (
    <div className="orders-page">
      <div className="orders-tabs" aria-label="Order status filter">
        {orderTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeStatus === tab ? "active" : ""}
            onClick={() => setActiveStatus(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="orders-card">
        <ReactTable
          className="orders-table"
          data={filteredOrders}
          columns={columns}
          emptyMessage="No orders found."
          getRowId={(row) => row.orderId}
          onRowClick={onOrderSelect}
        />
      </div>
    </div>
  );
};

export default Orders;
