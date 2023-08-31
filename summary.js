/* eslint-disable no-unused-vars */
/* global Chart, stats, pixelToMeter */

async function createSummary() {
  // set example data
  const weekData = await stats.getWeeklyStats();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  /** @type {Chart.ChartData} */
  const data = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [
      {
        label: 'Daily summary',
        backgroundColor: 'rgba(9, 132, 255, 0.7)',
        borderColor: 'rgba(9, 132, 255, 0.9)',
        borderWidth: 2,
        hoverBackgroundColor: '#40F8FF',
        data: weekData.map(({ distance }) => pixelToMeter(distance)),
      },
    ],
  };

  /** @type {Chart.ChartOptions} */
  const options = {
    title: {
      text: 'Summary',
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItem) => {
            return days[tooltipItem[0].dataIndex];
          },
          label: (tooltipItem) => `${tooltipItem.formattedValue}m`,
        },
      },
    },
    maintainAspectRatio: true,
    scales: {
      y: {
        stacked: true,
        grid: {
          display: true,
          color: 'rgba(255,99,132,0.2)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  new Chart('scroll-summary', {
    type: 'bar',
    options: options,
    data: data,
  });
}

createSummary();
