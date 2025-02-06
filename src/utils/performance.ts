export const measurePerformance = (metric: string) => {
  if ('performance' in window) {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    
    console.log(`${metric}:`, {
      loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
      firstPaint: paintEntries[0]?.startTime,
      firstContentfulPaint: paintEntries[1]?.startTime,
    });
  }
};