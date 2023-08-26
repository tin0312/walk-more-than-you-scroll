/* eslint-disable no-unused-vars */
/* global Chart, stats, pixelToMeter */

async function createSummary() {
  // set example data
  const weekData = await stats.getWeeklyStats();
  const data = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [
      {
        label: 'Daily summary',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: weekData.map((distance) => pixelToMeter(distance)),
      },
    ],
  };

  const options = {
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
