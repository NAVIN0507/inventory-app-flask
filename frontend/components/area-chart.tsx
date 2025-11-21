import React, { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
);

interface AreaChartProps {
  totalProducts: number[];
}

const AreaChart: React.FC<AreaChartProps> = ({ totalProducts }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: totalProducts.map((_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "Metrices",
            data: totalProducts,
            fill: true,
            backgroundColor: "oklch(0.7752 0.189 135)",
            borderColor: "oklch(0.7752 0.189 135)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [totalProducts]);

  return <canvas ref={chartRef}></canvas>;
};

export default AreaChart;
