import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = () => {
  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
const labels = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const values = [500, 700, 800, 600, 900, 750, 500, 790, 400, 500, 600, 700];

// حدد أعلى قيمة
const maxValue = Math.max(...values);

// أنشئ ألوان حسب القيمة
const backgroundColors = values.map(value =>
  value === maxValue ? '#730FC9' : '#E8E8EA' // orange-500 و gray-900 من Tailwind
);

const data = {
  labels: labels,
  datasets: [
    {
      label: '',
      data: values,
      backgroundColor: backgroundColors,
      borderRadius: 6,
      barThickness: 40
    }
  ]
};


    myChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16
              }
            }
          },
          title: {
            display: true,
            text: 'Total Volunteers ',
            font: {
              size: 20
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 14
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 14
              }
            }
          }
        }
      }
    });

    return () => {
      myChartRef.current.destroy();
    };
  }, []);

  return (
    <div className="w-[90%]  h-[300px] p-4 bg-white rounded-lg shadow-lg">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default BarChart;
