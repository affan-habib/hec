'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ data, title, height = 300, horizontal = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: horizontal ? 'bar' : 'bar',
        data: {
          labels: data.labels,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            borderRadius: 4,
            maxBarThickness: 40,
          })),
        },
        options: {
          indexAxis: horizontal ? 'y' : 'x',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                boxWidth: 6,
                font: {
                  size: 12,
                },
              },
            },
            title: {
              display: !!title,
              text: title,
              font: {
                size: 16,
              },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleFont: {
                size: 12,
              },
              bodyFont: {
                size: 12,
              },
              padding: 10,
              cornerRadius: 4,
            },
          },
          scales: {
            x: {
              grid: {
                display: !horizontal,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: horizontal,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, horizontal]);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BarChart;
