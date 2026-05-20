import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReactTable from "../ui/ReactTable";
import "./CashBack.scss";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const cashbackSummary = {
  issued30Days: {
    title: "Issued (30d)",
    value: 6250,
    subtitle: "Across 4 transactions",
  },
  redeemed: {
    title: "Redeemed",
    value: 2540,
    subtitle: "Conversion rate",
    highlight: "68%",
  },
  avgEarnPerOrder: {
    title: "Avg Earn / Order",
    value: 1480,
    subtitle: "Up from",
    previousValue: 1210,
    suffix: "last month",
  },
};

export const cashbackDetails = [
  {
    id: "CB-9821",
    customerName: "Aanya Kapoor",
    orderId: "MS-10247",
    type: "Earned",
    amount: 1240,
    date: "12 Jan 2026",
  },
  {
    id: "CB-9820",
    customerName: "Rohan Mehta",
    orderId: "MS-10246",
    type: "Earned",
    amount: 850,
    date: "12 Jan 2026",
  },
  {
    id: "CB-9819",
    customerName: "Ishita Verma",
    orderId: "MS-10245",
    type: "Redeemed",
    amount: -2000,
    date: "11 Jan 2026",
  },
  {
    id: "CB-9818",
    customerName: "Karan Shah",
    orderId: "MS-10244",
    type: "Earned",
    amount: 2580,
    date: "11 Jan 2026",
  },
  {
    id: "CB-9817",
    customerName: "Vikram Bose",
    orderId: "MS-10242",
    type: "Earned",
    amount: 1580,
    date: "10 Jan 2026",
  },
  {
    id: "CB-9816",
    customerName: "Priya Nair",
    orderId: "MS-10241",
    type: "Redeemed",
    amount: -540,
    date: "09 Jan 2026",
  },
];

export const earningTiers = [
  {
    id: "silver",
    name: "Silver",
    rate: 2,
    minimumSpend: 0,
    description: "On every purchase",
  },
  {
    id: "gold",
    name: "Gold",
    rate: 4,
    minimumSpend: 50000,
    description: "Free delivery above ₹25K",
  },
  {
    id: "platinum",
    name: "Platinum",
    rate: 6,
    minimumSpend: 200000,
    description: "Priority support, early access",
  },
];

const cashbackFlow = [
  { month: "Apr", amount: 118 },
  { month: "May", amount: 140 },
  { month: "Jun", amount: 130 },
  { month: "Jul", amount: 174 },
  { month: "Aug", amount: 152 },
  { month: "Sep", amount: 186 },
  { month: "Oct", amount: 208 },
  { month: "Nov", amount: 202 },
  { month: "Dec", amount: 238 },
  { month: "Jan", amount: 220 },
  { month: "Feb", amount: 252 },
  { month: "Mar", amount: 280 },
];

const CashBack = ({ searchTerm = "" }) => {
  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return cashbackDetails;
    }

    return cashbackDetails.filter((transaction) =>
      [
        transaction.id,
        transaction.customerName,
        transaction.orderId,
        transaction.type,
        transaction.date,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [searchTerm]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "customerName",
        header: "CUSTOMER",
        cell: ({ getValue }) => <strong>{getValue()}</strong>,
      },
      {
        accessorKey: "orderId",
        header: "ORDER",
      },
      {
        accessorKey: "type",
        header: "TYPE",
        cell: ({ getValue }) => {
          const type = getValue();

          return (
            <span className={`cashback-type cashback-type--${type.toLowerCase()}`}>
              {type}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ getValue }) => {
          const amount = getValue();
          const label = `${amount > 0 ? "+ " : "- "}${formatCurrency(Math.abs(amount))}`;

          return (
            <strong
              className={`cashback-amount ${
                amount > 0 ? "cashback-amount--earned" : "cashback-amount--redeemed"
              }`}
            >
              {label}
            </strong>
          );
        },
      },
      {
        accessorKey: "date",
        header: "DATE",
      },
    ],
    []
  );

  return (
    <div className="cashback-page">
      <section className="cashback-summary">
        <article className="cashback-stat cashback-stat--issued">
          <p>ISSUED (30D)</p>
          <h3>{formatCurrency(cashbackSummary.issued30Days.value)}</h3>
          <span>{cashbackSummary.issued30Days.subtitle}</span>
        </article>

        <article className="cashback-stat">
          <p>REDEEMED</p>
          <h3>{formatCurrency(cashbackSummary.redeemed.value)}</h3>
          <span>
            {cashbackSummary.redeemed.subtitle}{" "}
            <strong>{cashbackSummary.redeemed.highlight}</strong>
          </span>
        </article>

        <article className="cashback-stat">
          <p>AVG EARN / ORDER</p>
          <h3>{formatCurrency(cashbackSummary.avgEarnPerOrder.value)}</h3>
          <span>
            {cashbackSummary.avgEarnPerOrder.subtitle}{" "}
            {formatCurrency(cashbackSummary.avgEarnPerOrder.previousValue)}{" "}
            {cashbackSummary.avgEarnPerOrder.suffix}
          </span>
        </article>
      </section>

      <section className="cashback-grid">
        <article className="cashback-card cashback-card--chart">
          <p className="cashback-eyebrow">CASHBACK FLOW</p>
          <h2>Last 12 months</h2>
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={cashbackFlow} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e5e0d8" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} domain={[0, 300]} />
              <Tooltip />
              <Bar dataKey="amount" fill="#c75c39" radius={[8, 8, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="cashback-card">
          <p className="cashback-eyebrow">EARNING TIERS</p>
          <div className="tier-list">
            {earningTiers.map((tier) => (
              <div className="tier-card" key={tier.id}>
                <div>
                  <span className={`tier-badge tier-badge--${tier.id}`}>{tier.name}</span>
                  <p>
                    Spend &ge; {formatCurrency(tier.minimumSpend)} - {tier.description}
                  </p>
                </div>
                <strong>{tier.rate}%</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="cashback-transactions">
        <div className="cashback-transactions__header">
          <h2>Recent transactions</h2>
          <button type="button">Export CSV -&gt;</button>
        </div>
        <ReactTable
          className="cashback-table"
          data={filteredTransactions}
          columns={columns}
          emptyMessage="No cashback transactions found."
          getRowId={(row) => row.id}
        />
      </section>
    </div>
  );
};

export default CashBack;
