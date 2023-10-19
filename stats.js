/**
 * @typedef {Object} DayStats
 * @property {number} totalDistance
 * @property {Object.<string, {distance: number}>} domains
 * @property {Array<string>} pausedDomains
 */

const stats = {
  getTotalDistance: async (date = new Date()) => {
    const { dayStats } = await stats.getDayStats(date);
    return dayStats.totalDistance;
  },

  getDomainDistance: async (domain, date = new Date()) => {
    const { dayStats } = await stats.getDayStats(date);
    return dayStats.domains[domain]?.distance || 0;
  },

  getTodayStats: async () => {
    const date = new Date();
    return stats.getDayStats(date);
  },

  updateDistance: async (domain, distance) => {
    const date = new Date();
    const { dayStats, pausedDomains } = await stats.getDayStats(date);

    dayStats.totalDistance += distance;
    dayStats.domains[domain] = {
      distance: (dayStats.domains?.[domain]?.distance || 0) + distance,
    };

    return stats.updateDayStats(date, dayStats, pausedDomains);
  },

  // pause tracking on current site
  pauseCurrentSite: async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].url) {
      const websiteDomain = new URL(tabs[0].url).hostname;
      const { pausedDomains } = (await chrome.storage.local.get(['pausedDomains'])) || [];

      if (!pausedDomains.includes(websiteDomain)) {
        pausedDomains.push(websiteDomain);
      }

      return chrome.storage.local.set({ pausedDomains });
    }
  },

  // check if tracking of current website is paused
  isPaused: async (domain) => {
    const { pausedDomains, isPaused } = (await chrome.storage.local.get(['pausedDomains', 'isPaused'])) || [];
    return pausedDomains.includes(domain) || isPaused;
  },

  unpauseCurrentSite: async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].url) {
      const activeURL = new URL(tabs[0].url);
      const websiteDomain = activeURL.hostname;
      const { pausedDomains } = (await chrome.storage.local.get(['pausedDomains'])) || [];
      const currentDomainIndex = pausedDomains.indexOf(websiteDomain);
      if (currentDomainIndex > -1) {
        pausedDomains.splice(currentDomainIndex, 1);
      }
      return chrome.storage.local.set({ pausedDomains });
    }
  },

  pauseAll: async () => {
    chrome.storage.local.set({ isPaused: true });
  },

  unpauseAll: async () => {
    chrome.storage.local.set({ isPaused: false });
  },

  isAllPaused: async () => {
    const isPaused = await chrome.storage.local.get(['isPaused']);
    return !!isPaused;
  },

  getWeeklyStats: async () => {
    const today = new Date();
    const { days } = await chrome.storage.local.get(['days']);
    let week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const scrollDistance = days[date.toLocaleDateString()]?.totalDistance || 0;
      week.push({
        distance: scrollDistance,
        date: date.toLocaleDateString(),
        day: date.getDay(),
      });
      if (date.getDay() === 0) break;
    }

    while (week.length < 7) {
      week.splice(0, 0, 0);
    }

    return week.reverse();
  },

  /** @type {(date: Date) => Promise<{dayStats: DayStats, pausedDomains: string[]}>} */
  getDayStats: async (date) => {
    const { days } = await chrome.storage.local.get(['days']);
    const dateString = date.toLocaleDateString();
    if (!days[dateString]) {
      days[dateString] = {
        daysStats: {
          totalDistance: 0,
          domains: {},
        },
        pausedDomains: [],
      };
    }

    return days[dateString];
  },

  /**  @type {(date: Date, dayStats: DayStats, pausedDomains: string[]) => Promise<void>} */
  updateDayStats: async (date, dayStats, pausedDomains) => {
    const { days } = await chrome.storage.local.get(['days']);
    const dateString = date.toLocaleDateString();
    days[dateString] = dayStats;
    days.pausedDomains = pausedDomains;
    return chrome.storage.local.set({ days });
  },
};
