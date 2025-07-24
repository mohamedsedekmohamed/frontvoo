import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTranslation } from 'react-i18next';

const BarChart = ({All}) => {
  const chartRef = useRef(null);
  const myChartRef = useRef(null);
     const { t, i18n } = useTranslation();

 useEffect(() => {
  if (!All) return; // ✅ تأكد أن All موجود

  const ctx = chartRef.current.getContext('2d');

  const labels = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const values = [
    All.Jan ?? 0, All.Feb ?? 0, All.Mar ?? 0, All.Apr ?? 0,
    All.May ?? 0, All.June ?? 0, All.July ?? 0, All.Aug ?? 0,
    All.Sep ?? 0, All.Oct ?? 0, All.Nov ?? 0, All.Dec ?? 0
  ];

  const maxValue = Math.max(...values);

  const backgroundColors = values.map(value =>
    value === maxValue ? '#730FC9' : '#E8E8EA'
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
        legend: { display: false },
        title: {
          display: true,
          text: t('TotalVolunteers'),
          font: { size: 20 }
        }
      },
      scales: {
        x: {
          ticks: {
            font: { size: 14 }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 14 }
          }
        }
      }
    }
  });

  return () => {
    if (myChartRef.current) {
      myChartRef.current.destroy();
    }
  };
}, [All]); // ✅ أضف All إلى قائمة الاعتماد

  return (
    <div className="w-[90%]  h-[300px] p-4 bg-[#F7F3FB] rounded-lg shadow-lg">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default BarChart;
