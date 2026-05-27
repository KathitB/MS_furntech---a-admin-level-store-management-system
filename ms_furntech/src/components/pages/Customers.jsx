import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import ReactTable from "../ui/ReactTable";
import "./Customers.scss";

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

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Customers = ({ searchTerm = "", onCustomerSelect }) => {
  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return customerLTVDetails.filter((customer) => {
      //   const matchesStatus =
      //     activeStatus === "All" || customer.status === activeStatus;

      const matchesSearch =
        !query ||
        [
          customer.Id,
          customer.name,
          customer.email,
          customer.city,
          customer.orders,
          customer.ltv,
          customer.cashback,
          customer.tier,
          customer.joined,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesSearch;
    });
  }, [searchTerm]);

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "CUSTOMER",
        cell: ({ row }) => (
          <div className="customers-table__customer">
            <div className="customers-table__avatar">
              {row.original.initials}
            </div>

            <div className="customers-table__customer-info">
              <strong>{row.original.name}</strong>
              <span>{row.original.email}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "city",
        header: "CITY",
      },
      {
        accessorKey: "orders",
        header: "ORDERS",
        cell: ({ getValue }) => (
          <span className="customers-table__orders">{getValue()}</span>
        ),
      },
      {
        accessorKey: "ltv",
        header: "LTV",
        cell: ({ getValue }) => (
          <strong className="customers-table__amount">
            {formatAmount(getValue())}
          </strong>
        ),
      },
      {
        accessorKey: "cashback",
        header: "CASHBACK",
        cell: ({ getValue }) => (
          <span className="customers-table__cashback">
            {formatAmount(getValue())}
          </span>
        ),
      },
      {
        accessorKey: "tier",
        header: "TIER",
        cell: ({ getValue }) => {
          const tier = getValue();
          const className = tier.toLowerCase();

          return (
            <span className={`tier-pill tier-pill--${className}`}>{tier}</span>
          );
        },
      },
      {
        accessorKey: "joined",
        header: "JOINED",
      },
      {
        id: "open",
        header: "",
        cell: () => <span className="customers-table__arrow">&gt;</span>,
      },
    ],
    [],
  );

  return (
    <div className="customers-page">
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
      <div className="customers-card">
        <ReactTable
          className="customers-table"
          data={filteredCustomers}
          columns={columns}
          emptyMessage="No orders found."
          getRowId={(row) => row.id}
          onRowClick={onCustomerSelect}
        />
      </div>
    </div>
  );
};

export default Customers;
