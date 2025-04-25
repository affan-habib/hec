'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data, title, height = 300, doughnut = false }) => {
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
        type: doughnut ? 'doughnut' : 'pie',
        data: {
          labels: data.labels,
          datasets: [
            {
              data: data.values,
              backgroundColor: data.colors || [
                '#4F46E5', // indigo-600
                '#7C3AED', // violet-600
                '#EC4899', // pink-600
                '#F59E0B', // amber-500
                '#10B981', // emerald-500
                '#3B82F6', // blue-500
                '#8B5CF6', // purple-500
                '#EF4444', // red-500
                '#14B8A6', // teal-500
                '#6366F1', // indigo-500
              ],
              borderWidth: 1,
              borderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleFont: {
                size: 12,
              },
              bodyFont: {
                size: 12,
              },
              padding: 10,
              cornerRadius: 4,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            },
          },
          cutout: doughnut ? '60%' : 0,
          radius: '90%',
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, doughnut]);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
