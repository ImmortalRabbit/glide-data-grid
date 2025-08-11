export interface PerformanceMetrics {
    renderTime: number;
    scrollPerformance: number;
    memoryUsage: number;
    cellRenderTime: number;
    virtualScrollEfficiency: number;
    canvasDrawTime: number;
    dataProcessingTime: number;
    resizeTime: number;
    selectionTime: number;
    editingLatency: number;
}

export interface PerformanceBenchmark {
    name: string;
    description: string;
    setup: () => Promise<void>;
    run: () => Promise<PerformanceMetrics>;
    teardown: () => Promise<void>;
    expectedThresholds: Partial<PerformanceMetrics>;
}

export interface PerformanceTestConfig {
    warmupRuns: number;
    measurementRuns: number;
    timeout: number;
    memoryProfiling: boolean;
    outputFormat: 'json' | 'csv' | 'console';
    baselineFile?: string;
}

export class PerformanceTracker {
    private metrics: Map<string, number[]> = new Map();
    private memoryBaseline = 0;
    private startTime = 0;

    startMeasurement(name: string): void {
        this.startTime = performance.now();
        if (typeof window !== 'undefined' && 'memory' in performance) {
            this.memoryBaseline = (performance as any).memory.usedJSHeapSize;
        }
    }

    endMeasurement(name: string): number {
        const duration = performance.now() - this.startTime;
        
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name)!.push(duration);
        
        return duration;
    }

    measureMemoryUsage(): number {
        if (typeof window !== 'undefined' && 'memory' in performance) {
            const current = (performance as any).memory.usedJSHeapSize;
            return current - this.memoryBaseline;
        }
        return 0;
    }

    measureFPS(duration: number = 1000): Promise<number> {
        return new Promise((resolve) => {
            let frames = 0;
            const startTime = performance.now();
            
            const countFrame = () => {
                frames++;
                const elapsed = performance.now() - startTime;
                if (elapsed < duration) {
                    requestAnimationFrame(countFrame);
                } else {
                    resolve((frames * 1000) / elapsed);
                }
            };
            
            requestAnimationFrame(countFrame);
        });
    }

    getAverageMetric(name: string): number {
        const values = this.metrics.get(name) || [];
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }

    getPercentile(name: string, percentile: number): number {
        const values = (this.metrics.get(name) || []).sort((a, b) => a - b);
        if (values.length === 0) return 0;
        
        const index = Math.ceil((percentile / 100) * values.length) - 1;
        return values[Math.max(0, index)];
    }

    clear(): void {
        this.metrics.clear();
    }

    exportResults(): Record<string, any> {
        const results: Record<string, any> = {};
        
        for (const [name, values] of this.metrics.entries()) {
            results[name] = {
                average: this.getAverageMetric(name),
                median: this.getPercentile(name, 50),
                p95: this.getPercentile(name, 95),
                p99: this.getPercentile(name, 99),
                min: Math.min(...values),
                max: Math.max(...values),
                samples: values.length,
                standardDeviation: this.calculateStandardDeviation(values)
            };
        }
        
        return results;
    }

    private calculateStandardDeviation(values: number[]): number {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
        const avgSquaredDiff = squaredDifferences.reduce((a, b) => a + b, 0) / values.length;
        return Math.sqrt(avgSquaredDiff);
    }
}

export class PerformanceReporter {
    static compareResults(current: Record<string, any>, baseline: Record<string, any>): Record<string, any> {
        const comparison: Record<string, any> = {};
        
        for (const metric in current) {
            if (baseline[metric]) {
                const currentAvg = current[metric].average;
                const baselineAvg = baseline[metric].average;
                const improvement = ((baselineAvg - currentAvg) / baselineAvg) * 100;
                
                comparison[metric] = {
                    current: currentAvg,
                    baseline: baselineAvg,
                    improvement: improvement,
                    status: improvement > 5 ? 'improved' : improvement < -5 ? 'regressed' : 'stable'
                };
            }
        }
        
        return comparison;
    }

    static generateReport(results: Record<string, any>, comparison?: Record<string, any>): string {
        let report = '# Performance Test Results\n\n';
        
        report += '| Metric | Average | Median | P95 | P99 | Status |\n';
        report += '|--------|---------|--------|-----|-----|--------|\n';
        
        for (const [metric, data] of Object.entries(results)) {
            const status = comparison?.[metric]?.status || 'baseline';
            const improvement = comparison?.[metric]?.improvement || 0;
            const statusIcon = status === 'improved' ? '✅' : status === 'regressed' ? '❌' : '⚪';
            
            report += `| ${metric} | ${data.average.toFixed(2)}ms | ${data.median.toFixed(2)}ms | ${data.p95.toFixed(2)}ms | ${data.p99.toFixed(2)}ms | ${statusIcon} ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}% |\n`;
        }
        
        return report;
    }
}

// Canvas-specific performance utilities
export class CanvasPerformanceTracker extends PerformanceTracker {
    measureCanvasDrawTime(canvas: HTMLCanvasElement, drawFunction: () => void): number {
        this.startMeasurement('canvas-draw');
        
        const ctx = canvas.getContext('2d')!;
        const imageDataBefore = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        drawFunction();
        
        const imageDataAfter = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelsChanged = this.countChangedPixels(imageDataBefore, imageDataAfter);
        
        const drawTime = this.endMeasurement('canvas-draw');
        
        // Store additional metrics
        this.metrics.set('pixels-changed', [pixelsChanged]);
        this.metrics.set('pixels-per-ms', [pixelsChanged / drawTime]);
        
        return drawTime;
    }

    private countChangedPixels(before: ImageData, after: ImageData): number {
        let changed = 0;
        const threshold = 1; // Allow for minor anti-aliasing differences
        
        for (let i = 0; i < before.data.length; i += 4) {
            const rDiff = Math.abs(before.data[i] - after.data[i]);
            const gDiff = Math.abs(before.data[i + 1] - after.data[i + 1]);
            const bDiff = Math.abs(before.data[i + 2] - after.data[i + 2]);
            const aDiff = Math.abs(before.data[i + 3] - after.data[i + 3]);
            
            if (rDiff > threshold || gDiff > threshold || bDiff > threshold || aDiff > threshold) {
                changed++;
            }
        }
        
        return Math.floor(changed / 4); // Convert from pixel components to pixels
    }
}