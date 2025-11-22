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
  title: string;
  description: string;
}

const AreaChart: React.FC<AreaChartProps> = ({
  totalProducts,
  title,
  description,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const buildChart = () => {
    if (!chartRef.current) return;

    const width = window.innerWidth;
    const isMobile = width < 600;
    const isTablet = width >= 600 && width < 1024;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: totalProducts.map((_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "Metrics",
            data: totalProducts,
            fill: true,
            backgroundColor: "rgba(139, 92, 246, 0.12)",
            borderColor: "rgb(139, 92, 246)",
            borderWidth: isMobile ? 1 : 1.5,
            tension: 0.35,
            pointRadius: isMobile ? 1 : 2,
            pointHoverRadius: isMobile ? 2 : 4,
            pointBackgroundColor: "rgb(139, 92, 246)",
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false, // Allows you to control height with Tailwind

        plugins: {
          legend: {
            display: !isMobile,
            position: "top",
            labels: {
              usePointStyle: true,
              font: { size: isMobile ? 9 : 11 },
            },
          },
          tooltip: {
            bodyFont: { size: isMobile ? 9 : 11 },
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: isMobile ? 5 : 5,
          },
        },

        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: isMobile ? 45 : 0,
              minRotation: isMobile ? 45 : 0,
              font: { size: isMobile ? 8 : 11 },
              autoSkip: true,
              maxTicksLimit: isMobile ? 3 : isTablet ? 6 : 10,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: {
              font: { size: isMobile ? 8 : 11 },
              maxTicksLimit: isMobile ? 3 : 5,
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    buildChart();
    window.addEventListener("resize", buildChart);
    return () => window.removeEventListener("resize", buildChart);
  }, [totalProducts]);

  return (
    <div className="w-full bg-card border rounded-lg p-3 sm:p-4">
      <div className="mb-2 sm:mb-3">
        <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      {/* SMALLER HEIGHT HERE */}
      <div className="relative w-full h-[160px] sm:h-[220px] md:h-[260px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default AreaChart;
