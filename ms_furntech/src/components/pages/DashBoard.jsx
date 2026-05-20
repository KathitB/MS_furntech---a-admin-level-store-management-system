import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import LineChart from "../ui/LineChart";
import ReactTable from "../ui/ReactTable";
import "./DashBoard.scss";
import item1 from "../../assets/item1.png";
import item2 from "../../assets/item2.jpeg";
import item3 from "../../assets/item3.png";
import item4 from "../../assets/item4.jpeg";

const metricCards = [
  {
    label: "NET REVENUE",
    value: "48.2L",
    prefix: true,
    change: "+12.4%",
    trend: "up",
    data: [
      { name: "1", value: 22 },
      { name: "2", value: 25 },
      { name: "3", value: 23 },
      { name: "4", value: 28 },
      { name: "5", value: 27 },
      { name: "6", value: 33 },
      { name: "7", value: 35 },
      { name: "8", value: 34 },
      { name: "9", value: 39 },
      { name: "10", value: 38 },
      { name: "11", value: 44 },
      { name: "12", value: 48 },
    ],
  },
  {
    label: "ORDERS PLACED",
    value: "1,284",
    change: "+8.1%",
    trend: "up",
    data: [
      { name: "1", value: 31 },
      { name: "2", value: 33 },
      { name: "3", value: 32 },
      { name: "4", value: 37 },
      { name: "5", value: 36 },
      { name: "6", value: 41 },
      { name: "7", value: 40 },
      { name: "8", value: 44 },
      { name: "9", value: 43 },
      { name: "10", value: 47 },
      { name: "11", value: 49 },
      { name: "12", value: 52 },
    ],
  },
  {
    label: "ACTIVE CUSTOMERS",
    value: "3,941",
    change: "+3.6%",
    trend: "up",
    data: [
      { name: "1", value: 42 },
      { name: "2", value: 43 },
      { name: "3", value: 43 },
      { name: "4", value: 45 },
      { name: "5", value: 46 },
      { name: "6", value: 47 },
      { name: "7", value: 48 },
      { name: "8", value: 49 },
      { name: "9", value: 50 },
      { name: "10", value: 51 },
      { name: "11", value: 53 },
      { name: "12", value: 56 },
    ],
  },
  {
    label: "CASHBACK ISSUED",
    value: "2.14L",
    prefix: true,
    change: "-1.2%",
    trend: "down",
    data: [
      { name: "1", value: 42 },
      { name: "2", value: 45 },
      { name: "3", value: 43 },
      { name: "4", value: 47 },
      { name: "5", value: 45 },
      { name: "6", value: 49 },
      { name: "7", value: 47 },
      { name: "8", value: 51 },
      { name: "9", value: 50 },
      { name: "10", value: 49 },
      { name: "11", value: 48 },
      { name: "12", value: 47 },
    ],
  },
];

const revenueData = [
  { month: "Apr", revenue: 96, orders: 28 },
  { month: "May", revenue: 108, orders: 34 },
  { month: "Jun", revenue: 103, orders: 31 },
  { month: "Jul", revenue: 123, orders: 42 },
  { month: "Aug", revenue: 118, orders: 38 },
  { month: "Sep", revenue: 142, orders: 46 },
  { month: "Oct", revenue: 158, orders: 52 },
  { month: "Nov", revenue: 155, orders: 49 },
  { month: "Dec", revenue: 176, orders: 58 },
  { month: "Jan", revenue: 169, orders: 54 },
  { month: "Feb", revenue: 185, orders: 63 },
  { month: "Mar", revenue: 200, orders: 68 },
];

const categoryData = [
  { name: "Sofas", value: 38, color: "#c95a38" },
  { name: "Tables", value: 24, color: "#173a2f" },
  { name: "Chairs", value: 22, color: "#efc75e" },
  { name: "Decor", value: 16, color: "#2f7658" },
];

const recentOrders = [
  {
    order: "MS-10247",
    customer: "Aanya Kapoor",
    city: "Mumbai",
    amount: "82,400",
    status: "In Transit",
  },
  {
    order: "MS-10246",
    customer: "Rohan Mehta",
    city: "Bangalore",
    amount: "42,500",
    status: "Processing",
  },
  {
    order: "MS-10245",
    customer: "Ishita Verma",
    city: "Delhi",
    amount: "64,200",
    status: "Delivered",
  },
  {
    order: "MS-10244",
    customer: "Karan Shah",
    city: "Pune",
    amount: "1,28,900",
    status: "Delivered",
  },
  {
    order: "MS-10243",
    customer: "Neha Iyer",
    city: "Chennai",
    amount: "32,400",
    status: "Cancelled",
  },
  {
    order: "MS-10242",
    customer: "Vikram Bose",
    city: "Kolkata",
    amount: "78,900",
    status: "Delivered",
  },
];

const topProducts = [
  {
    name: "Velvet Emerald Armchair",
    category: "Chairs",
    price: "42,500",
    count: 12,
    image: item1,
  },
  {
    name: "Heritage Solid Oak Table",
    category: "Tables",
    price: "78,900",
    count: 6,
    image: item2,
  },
  {
    name: "Atelier Walnut Rocker",
    category: "Chairs",
    price: "32,400",
    count: 18,
    image: item3,
  },
  {
    name: "Sage Linen Cushion Set",
    category: "Decor",
    price: "5,400",
    count: 64,
    image: item4,
  },
];

const topCities = [
  { name: "Mumbai", value: 412 },
  { name: "Bangalore", value: 308 },
  { name: "Delhi", value: 246 },
  { name: "Pune", value: 168 },
  { name: "Others", value: 150 },
];

const DashBoard = ({ onOrderSelect }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "order",
        header: "ORDER",
      },
      {
        accessorKey: "customer",
        header: "CUSTOMER",
        cell: ({ row }) => (
          <div>
            <strong>{row.original.customer}</strong>
            <span>{row.original.city}</span>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ getValue }) => <strong>&#8377;{getValue()}</strong>,
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
        cell: () => <span className="dashboard-table__arrow">&gt;</span>,
      },
    ],
    [],
  );

  return (
    <div className="dashboard-page">
      <section className="dashboard-metrics">
        {metricCards.map((card) => (
          <article className="metric-card" key={card.label}>
            <div className="metric-card__topline">{card.label}</div>
            <div className="metric-card__value-row">
              <h3>
                {card.prefix && <span>&#8377; </span>}
                {card.value}
              </h3>
              <span
                className={`metric-card__change metric-card__change--${card.trend}`}
              >
                {card.trend === "up" ? "Up" : "Down"} {card.change}
              </span>
            </div>
            <LineChart
              className="metric-card__chart"
              data={card.data}
              height={58}
              showGrid={false}
              showTooltip={false}
              showXAxis={false}
              showYAxis={false}
              dot={false}
              strokeWidth={2}
              yAxisDomain={["dataMin - 5", "dataMax + 5"]}
              series={[
                {
                  dataKey: "value",
                  lineColor: card.trend === "down" ? "#ff3b47" : "#2f7658",
                  areaColor: card.trend === "down" ? "#ff3b47" : "#2f7658",
                  showArea: true,
                  areaOpacity: 0.16,
                },
              ]}
            />
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card dashboard-card--wide">
          <div className="dashboard-card__header">
            <div>
              <p className="dashboard-eyebrow">REVENUE & ORDERS</p>
              <h2>Last 12 months</h2>
            </div>
            <div className="range-tabs" aria-label="Chart range">
              <button type="button">3M</button>
              <button type="button">6M</button>
              <button type="button" className="active">
                1Y
              </button>
              <button type="button">ALL</button>
            </div>
          </div>
          <LineChart
            data={revenueData}
            xKey="month"
            height={330}
            lineColor="#173a2f"
            areaColor="#c95a38"
            tickFormatter={(value) => value}
            tooltipFormatter={(value, name) => [
              value,
              name === "revenue" ? "Revenue" : "Orders",
            ]}
            yAxisDomain={[0, 220]}
            xAxisPadding={{ left: 0, right: 0 }}
            dot={false}
            series={[
              {
                dataKey: "revenue",
                name: "Revenue",
                lineColor: "#173a2f",
                showArea: false,
                strokeWidth: 2,
              },
              {
                dataKey: "orders",
                name: "Orders",
                lineColor: "#c95a38",
                areaColor: "#c95a38",
                showArea: true,
                areaOpacity: 0.18,
                strokeWidth: 2,
              },
            ]}
          />
        </article>

        <article className="dashboard-card category-card">
          <p className="dashboard-eyebrow">CATEGORY MIX</p>
          <h2>By revenue</h2>
          <div className="donut-chart">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={95}
                  paddingAngle={5}
                  stroke="#fbfaf7"
                  strokeWidth={5}
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-chart__center">
              <span>TOTAL</span>
              <strong>&#8377;48.2L</strong>
            </div>
          </div>
          <div className="category-list">
            {categoryData.map((item) => (
              <div className="category-list__item" key={item.name}>
                <span style={{ backgroundColor: item.color }} />
                <p>{item.name}</p>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card dashboard-card--wide">
          <div className="dashboard-card__header">
            <div>
              <p className="dashboard-eyebrow">RECENT ORDERS</p>
              <h2>Latest 6</h2>
            </div>
            <button className="text-link" type="button">
              View all -&gt;
            </button>
          </div>
          <ReactTable
            className="dashboard-table"
            data={recentOrders}
            columns={columns}
            getRowId={(row) => row.order}
            onRowClick={(row) => onOrderSelect?.({ orderId: row.order })}
          />
        </article>

        <article className="dashboard-card side-card">
          <p className="dashboard-eyebrow">TOP PRODUCTS</p>
          <h2>This month</h2>
          <div className="product-list">
            {topProducts.map((product, index) => (
              <div className="product-row" key={product.name}>
                <span className="product-row__rank">{index + 1}</span>
                <img
                  className="product-row__image"
                  src={product.image}
                  alt=""
                />
                <div className="product-row__details">
                  <strong>{product.name}</strong>
                  <span>
                    {product.category} - &#8377;{product.price}
                  </span>
                </div>
                <small>{product.count}</small>
              </div>
            ))}
          </div>

          <div className="top-cities">
            <p className="dashboard-eyebrow">TOP CITIES</p>
            {topCities.map((city) => (
              <div className="city-row" key={city.name}>
                <span className="city-row__pin">o</span>
                <span>{city.name}</span>
                <div className="city-row__bar">
                  <span
                    style={{
                      width: `${(city.value / topCities[0].value) * 100}%`,
                    }}
                  />
                </div>
                <strong>{city.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default DashBoard;
