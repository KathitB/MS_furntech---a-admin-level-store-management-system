import React from "react";

import LineChart from "../ui/LineChart";
import "./Analytics.scss";

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

export const analyticsMetrics = [
  {
    id: "conversionRate",
    title: "Conversion Rate",
    value: 3.42,
    valueFormatted: "3.42%",
    subtitle: "↑ 0.4% vs last month",
    trend: "up",
    trendValue: 0.4,
    trendFormatted: "+0.4%",
  },
  {
    id: "avgOrderValue",
    title: "Avg Order Value",
    value: 67400,
    valueFormatted: "₹67,400",
    subtitle: "↑ ₹4.2K vs last month",
    trend: "up",
    trendValue: 4200,
    trendFormatted: "+₹4.2K",
  },
  {
    id: "customerRetention",
    title: "Customer Retention",
    value: 68,
    valueFormatted: "68%",
    subtitle: "90-day repeat purchase",
    trend: "neutral",
  },
];

const Analytics = ({ searchTerm = "" }) => {
  return (
    <div className="analytics-page">
      <section className="dashboard-metrics">
        {analyticsMetrics.map((card) => (
          <article className="metric-card" key={card.title}>
            <div className="metric-card__topline">{card.title}</div>
            <div className="metric-card__value-row">
              <h3>
                {/* {card.prefix && <span>&#8377; </span>} */}
                {card.valueFormatted}
              </h3>
              <span
                className={`metric-card__change metric-card__change--${card.trend}`}
              >
                {card.trend === "up" ? "Up" : "Down"} {card.change}
              </span>
              {/* <p  */}
            </div>
            {/* <LineChart
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
            /> */}
          </article>
        ))}
      </section>
      <br></br>
      <article className="dashboard-card dashboard-card--wide">
        <div className="dashboard-card__header">
          <div>
            <p className="dashboard-eyebrow">REVENUE VS ORDERS</p>
            <h2>Performance trend</h2>
          </div>
          {/* <div className="range-tabs" aria-label="Chart range">
            <button type="button">3M</button>
            <button type="button">6M</button>
            <button type="button" className="active">
              1Y
            </button>
            <button type="button">ALL</button>
          </div> */}
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
          dot={true}
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
              //   areaColor: "#c95a38",
              showArea: true,
              areaOpacity: 0,
              strokeWidth: 2,
            },
          ]}
        />
      </article>
    </div>
  );
};

export default Analytics;
