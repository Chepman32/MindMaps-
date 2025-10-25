import {Performance} from 'react-native';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();
  private maxMetrics = 100;

  /**
   * Start measuring a performance metric
   */
  mark(name: string) {
    this.marks.set(name, Date.now());
  }

  /**
   * End measuring and record the metric
   */
  measure(name: string, metadata?: Record<string, any>) {
    const startTime = this.marks.get(name);

    if (!startTime) {
      console.warn(`Performance mark "${name}" not found`);
      return;
    }

    const duration = Date.now() - startTime;

    this.recordMetric({
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    });

    this.marks.delete(name);

    if (__DEV__) {
      console.log(`[Performance] ${name}: ${duration}ms`, metadata || '');
    }
  }

  /**
   * Record a metric directly
   */
  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  /**
   * Get average duration for a metric
   */
  getAverageDuration(name: string): number {
    const metrics = this.getMetricsByName(name);

    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }

  /**
   * Get statistics for a metric
   */
  getStats(name: string) {
    const metrics = this.getMetricsByName(name);

    if (metrics.length === 0) {
      return {
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        total: 0,
      };
    }

    const durations = metrics.map((m) => m.duration);
    const total = durations.reduce((sum, d) => sum + d, 0);

    return {
      count: metrics.length,
      average: total / metrics.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      total,
    };
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
    this.marks.clear();
  }

  /**
   * Export metrics as JSON
   */
  export(): string {
    return JSON.stringify(
      {
        metrics: this.metrics,
        timestamp: Date.now(),
        summary: this.getSummary(),
      },
      null,
      2
    );
  }

  /**
   * Get summary of all metrics
   */
  getSummary() {
    const uniqueNames = [...new Set(this.metrics.map((m) => m.name))];

    return uniqueNames.map((name) => ({
      name,
      ...this.getStats(name),
    }));
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility decorator for measuring function performance
export const measurePerformance = (metricName: string) => {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      performanceMonitor.mark(metricName);

      try {
        const result = await originalMethod.apply(this, args);
        performanceMonitor.measure(metricName);
        return result;
      } catch (error) {
        performanceMonitor.measure(metricName, {error: true});
        throw error;
      }
    };

    return descriptor;
  };
};

// Hook for measuring component render performance
export const useMeasureRender = (componentName: string) => {
  React.useEffect(() => {
    performanceMonitor.mark(`${componentName}-render`);

    return () => {
      performanceMonitor.measure(`${componentName}-render`);
    };
  });
};

// Measure navigation performance
export const measureNavigation = (screenName: string) => {
  performanceMonitor.mark(`navigate-to-${screenName}`);

  return () => {
    performanceMonitor.measure(`navigate-to-${screenName}`);
  };
};

// FPS Monitor
export const startFPSMonitor = () => {
  let lastFrameTime = Date.now();
  let frameCount = 0;
  let fps = 60;

  const measureFrame = () => {
    const now = Date.now();
    frameCount++;

    if (now - lastFrameTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastFrameTime = now;

      if (fps < 50) {
        console.warn(`[Performance] Low FPS detected: ${fps}`);
      }
    }

    requestAnimationFrame(measureFrame);
  };

  requestAnimationFrame(measureFrame);

  return () => fps;
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if (global.performance && global.performance.memory) {
    const memory = (global.performance as any).memory;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }

  return null;
};
