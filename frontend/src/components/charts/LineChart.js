'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ data, title, height = 300 }) => {
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
        type: 'line',
        data: {
          labels: data.labels,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: dataset.borderColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
          })),
        },
        options: {
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
                display: false,
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
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
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
  }, [data, title]);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LineChart;
