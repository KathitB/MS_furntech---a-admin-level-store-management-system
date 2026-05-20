import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const defaultData = [
  { name: "Today", value: 300000 },
  { name: "in 6 months", value: 348000, growth: "+16%" },
  { name: "in 12 months", value: 366000, growth: "+2.3%" },
  { name: "in 18 months", value: 395000, growth: "+8.1%" },
];

const currencyTickFormatter = (value) => `\u00a3${value / 1000}K`;

const ReusableLineChart = ({
  data = defaultData,
  xKey = "name",
  dataKey = "value",
  series,
  height = 300,
  lineColor = "#2563eb",
  areaColor = "#3b82f6",
  areaOpacity = 0.8,
  strokeWidth = 3,
  showArea = true,
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  dot = true,
  xAxisPadding = { left: 50, right: 50 },
  yAxisDomain = ["dataMin", "dataMax+100000"],
  tickFormatter = currencyTickFormatter,
  tooltipFormatter,
  className = "",
  gradientId = "lineChartAreaGradient",
}) => {
  const chartSeries =
    series || [
      {
        dataKey,
        lineColor,
        areaColor,
        showArea,
        dot,
        strokeWidth,
      },
    ];

  const getDotStyle = (item) => {
    const itemDot = item.dot ?? dot;

    if (itemDot !== true) {
      return itemDot;
    }

    return {
      r: 6,
      fill: "#fff",
      stroke: item.lineColor || lineColor,
      strokeWidth: 3,
    };
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={areaColor} stopOpacity={areaOpacity} />
              <stop offset="100%" stopColor={areaColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}

          {showXAxis && <XAxis padding={xAxisPadding} dataKey={xKey} />}

          {showYAxis && <YAxis domain={yAxisDomain} tickFormatter={tickFormatter} />}

          {showTooltip && <Tooltip formatter={tooltipFormatter} />}

          {chartSeries.map((item, index) => {
            const itemLineColor = item.lineColor || lineColor;
            const itemAreaColor = item.areaColor || areaColor;
            const itemGradientId = `${gradientId}-${item.dataKey}-${index}`;
            const shouldShowArea = item.showArea ?? showArea;

            return (
              <React.Fragment key={item.dataKey}>
                {shouldShowArea && (
                  <>
                    <defs>
                      <linearGradient id={itemGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={itemAreaColor}
                          stopOpacity={item.areaOpacity ?? areaOpacity}
                        />
                        <stop offset="100%" stopColor={itemAreaColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey={item.dataKey}
                      stroke={itemAreaColor}
                      fill={`url(#${itemGradientId})`}
                      strokeWidth={item.strokeWidth || strokeWidth}
                    />
                  </>
                )}

                <Line
                  type="monotone"
                  dataKey={item.dataKey}
                  stroke={itemLineColor}
                  strokeWidth={item.strokeWidth || strokeWidth}
                  dot={getDotStyle(item)}
                  name={item.name}
                />
              </React.Fragment>
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReusableLineChart;
