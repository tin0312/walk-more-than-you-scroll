/* eslint-disable no-unused-vars */
/* global Chart, stats, pixelToMeter, updateDistance, updateScrollDistances */

async function createSummary() {
  /** @type {Chart} */
  let chart;
  const weekData = await stats.getWeeklyStats();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const todayIndex = new Date().getDay();
  let focusedDay = todayIndex;
  const isFocused = (index) => index === focusedDay;

  /** @type {Chart.ChartData} */
  const data = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [
      {
        label: 'Daily scroll distance',
        // highlight the selected day, gray out the rest
        backgroundColor: ({ dataIndex }) => (isFocused(dataIndex) ? '#0984FF' : '#B9B4C7'),
        borderColor: ({ dataIndex }) => (isFocused(dataIndex) ? '#0984FF' : '#B9B4C7'),
        borderWidth: 1,
        data: weekData.map(({ distance }) => pixelToMeter(distance)),
        minBarLength: 2,
      },
    ],
  };

  /** @type {Chart.ChartOptions} */
  const options = {
    title: {
      text: 'Summary',
    },
    plugins: {
      legend: {
        onClick: () => {},
      },
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
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    onClick: (event, chartElements) => {
      if (chartElements.length > 0) {
        const clickedBarIndex = chartElements[0].index;
        focusedDay = clickedBarIndex;
        const selectedDate = new Date();
        selectedDate.setDate(selectedDate.getDate() - (todayIndex - clickedBarIndex));

        stats.getDayStats(selectedDate).then(({ totalDistance, domains }) => {
          updateDistance(selectedDate, totalDistance);
          updateScrollDistances(domains);
        });

        chart.update();
      }
    },
  };

  return (chart = new Chart('scroll-summary', {
    type: 'bar',
    options: options,
    data: data,
  }));
}

createSummary();
