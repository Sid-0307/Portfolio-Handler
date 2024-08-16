import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-date-fns";

const StockChart = ({ stockData, symbol, interval }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.labels = stockData.labels;
      chartInstance.current.data.datasets[0].data = stockData.prices;
      chartInstance.current.data.datasets[0].label = `${symbol} Stock Price`;
      chartInstance.current.options.scales.x.time.unit =
        interval === "daily" ? "day" : "minute";
      chartInstance.current.options.scales.x.time.stepSize =
        interval === "daily" ? 1 : 15;
      chartInstance.current.update();
    } else {
      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: stockData.labels,
          datasets: [
            {
              label: `${symbol} Stock Price`,
              data: stockData.prices,
              borderColor: "rgb(58, 81, 127)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: interval === "daily" ? "day" : "minute",
                stepSize: interval === "daily" ? 1 : 15,
              },
            },
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    }
  }, [stockData, symbol, interval]);

  return <canvas ref={chartRef}></canvas>;
};

export default StockChart;
