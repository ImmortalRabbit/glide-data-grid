import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { DataEditor } from '../../src/index.js';
import { makeCell } from '../test-utils.js';
import { 
    PerformanceTracker, 
    CanvasPerformanceTracker, 
    PerformanceReporter,
    type PerformanceBenchmark,
    type PerformanceMetrics 
} from './performance-framework.js';

// Test data generators
function generateLargeDataset(rows: number, cols: number) {
    const data: any[][] = [];
    for (let i = 0; i < rows; i++) {
        const row: any[] = [];
        for (let j = 0; j < cols; j++) {
            row.push(`Cell ${i}-${j}`);
        }
        data.push(row);
    }
    return data;
}

function generateColumns(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        title: `Column ${i}`,
        width: 120,
        id: `col-${i}`
    }));
}

export class DataGridBenchmarks {
    private tracker = new PerformanceTracker();
    private canvasTracker = new CanvasPerformanceTracker();

    // Benchmark: Initial render performance
    async benchmarkInitialRender(rows: number, cols: number): Promise<PerformanceMetrics> {
        const data = generateLargeDataset(rows, cols);
        const columns = generateColumns(cols);
        
        this.tracker.startMeasurement('initial-render');
        
        const { container } = render(
            React.createElement(DataEditor, {
                getCellContent: ([col, row]) => makeCell([col, row]),
                columns: columns,
                rows: rows,
                width: 800,
                height: 600
            })
        );
        
        const renderTime = this.tracker.endMeasurement('initial-render');
        const memoryUsage = this.tracker.measureMemoryUsage();
        
        cleanup();
        
        return {
            renderTime,
            memoryUsage,
            scrollPerformance: 0,
            cellRenderTime: 0,
            virtualScrollEfficiency: 0,
            canvasDrawTime: 0,
            dataProcessingTime: 0,
            resizeTime: 0,
            selectionTime: 0,
            editingLatency: 0
        };
    }

    // Benchmark: Scrolling performance
    async benchmarkScrollPerformance(rows: number): Promise<number> {
        const columns = generateColumns(10);
        
        const { container } = render(
            React.createElement(DataEditor, {
                getCellContent: ([col, row]) => makeCell([col, row]),
                columns: columns,
                rows: rows,
                width: 800,
                height: 600
            })
        );

        const canvas = container.querySelector('canvas') as HTMLCanvasElement;
        
        this.tracker.startMeasurement('scroll-performance');
        
        // Simulate rapid scrolling
        const scrollEvents = 100;
        for (let i = 0; i < scrollEvents; i++) {
            canvas.dispatchEvent(new WheelEvent('wheel', {
                deltaY: 100,
                deltaMode: 0
            }));
            
            // Wait for next frame
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        
        const scrollTime = this.tracker.endMeasurement('scroll-performance');
        cleanup();
        
        return scrollTime / scrollEvents; // Average time per scroll event
    }

    // Benchmark: Canvas drawing performance
    async benchmarkCanvasDrawing(cellCount: number): Promise<number> {
        const rows = Math.sqrt(cellCount);
        const cols = Math.sqrt(cellCount);
        const columns = generateColumns(cols);
        
        const { container } = render(
            React.createElement(DataEditor, {
                getCellContent: ([col, row]) => makeCell([col, row]),
                columns: columns,
                rows: rows,
                width: 800,
                height: 600
            })
        );

        const canvas = container.querySelector('canvas') as HTMLCanvasElement;
        
        // Force a redraw and measure canvas performance
        const drawTime = this.canvasTracker.measureCanvasDrawTime(canvas, () => {
            // Trigger a redraw by dispatching a resize event
            window.dispatchEvent(new Event('resize'));
        });
        
        cleanup();
        return drawTime;
    }

    // Benchmark: Cell selection performance
    async benchmarkCellSelection(rows: number, cols: number): Promise<number> {
        const columns = generateColumns(cols);
        
        const { container } = render(
            React.createElement(DataEditor, {
                getCellContent: ([col, row]) => makeCell([col, row]),
                columns: columns,
                rows: rows,
                width: 800,
                height: 600
            })
        );

        const canvas = container.querySelector('canvas') as HTMLCanvasElement;
        
        this.tracker.startMeasurement('cell-selection');
        
        // Simulate selecting multiple cells
        const selections = 50;
        for (let i = 0; i < selections; i++) {
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: Math.random() * 800,
                clientY: Math.random() * 600,
                bubbles: true
            }));
            
            canvas.dispatchEvent(new MouseEvent('mouseup', {
                clientX: Math.random() * 800,
                clientY: Math.random() * 600,
                bubbles: true
            }));
            
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        
        const selectionTime = this.tracker.endMeasurement('cell-selection');
        cleanup();
        
        return selectionTime / selections;
    }

    // Benchmark: Data processing and virtual scrolling efficiency
    async benchmarkVirtualScrolling(totalRows: number): Promise<number> {
        const columns = generateColumns(5);
        
        this.tracker.startMeasurement('virtual-scroll-setup');
        
        const { container } = render(
            React.createElement(DataEditor, {
                getCellContent: ([col, row]) => makeCell([col, row]),
                columns: columns,
                rows: totalRows,
                width: 800,
                height: 600
            })
        );
        
        const setupTime = this.tracker.endMeasurement('virtual-scroll-setup');
        
        // Test scrolling to different positions
        const canvas = container.querySelector('canvas') as HTMLCanvasElement;
        
        this.tracker.startMeasurement('virtual-scroll-navigation');
        
        // Jump to different scroll positions
        const positions = [0, totalRows * 0.25, totalRows * 0.5, totalRows * 0.75, totalRows];
        
        for (const position of positions) {
            // Simulate scrolling to position
            for (let i = 0; i < 10; i++) {
                canvas.dispatchEvent(new WheelEvent('wheel', {
                    deltaY: position * 10,
                    deltaMode: 0
                }));
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
        }
        
        const navigationTime = this.tracker.endMeasurement('virtual-scroll-navigation');
        cleanup();
        
        return setupTime + navigationTime;
    }

    // Comprehensive benchmark suite
    async runFullBenchmarkSuite(): Promise<Record<string, any>> {
        const results: Record<string, any> = {};
        
        console.log('🔥 Running Data Grid Performance Benchmarks...\n');
        
        // Small dataset benchmarks
        console.log('📊 Small Dataset (100x10)');
        results.smallDatasetRender = await this.benchmarkInitialRender(100, 10);
        results.smallDatasetScroll = await this.benchmarkScrollPerformance(100);
        results.smallDatasetSelection = await this.benchmarkCellSelection(100, 10);
        
        // Medium dataset benchmarks  
        console.log('📊 Medium Dataset (1000x20)');
        results.mediumDatasetRender = await this.benchmarkInitialRender(1000, 20);
        results.mediumDatasetScroll = await this.benchmarkScrollPerformance(1000);
        results.mediumDatasetSelection = await this.benchmarkCellSelection(1000, 20);
        
        // Large dataset benchmarks
        console.log('📊 Large Dataset (10000x50)');
        results.largeDatasetRender = await this.benchmarkInitialRender(10000, 50);
        results.largeDatasetScroll = await this.benchmarkScrollPerformance(10000);
        results.largeDatasetVirtualScroll = await this.benchmarkVirtualScrolling(10000);
        
        // Canvas-specific benchmarks
        console.log('🎨 Canvas Performance');
        results.canvasDrawSmall = await this.benchmarkCanvasDrawing(100);
        results.canvasDrawMedium = await this.benchmarkCanvasDrawing(1000);
        results.canvasDrawLarge = await this.benchmarkCanvasDrawing(10000);
        
        // Export tracker results
        const trackerResults = this.tracker.exportResults();
        const canvasResults = this.canvasTracker.exportResults();
        
        return {
            benchmarks: results,
            detailed: {
                ...trackerResults,
                ...canvasResults
            }
        };
    }
}

// Predefined benchmark configurations
export const BENCHMARK_CONFIGS = {
    quick: {
        warmupRuns: 1,
        measurementRuns: 3,
        timeout: 30000,
        memoryProfiling: false,
        outputFormat: 'console' as const
    },
    standard: {
        warmupRuns: 2,
        measurementRuns: 5,
        timeout: 60000,
        memoryProfiling: true,
        outputFormat: 'json' as const
    },
    comprehensive: {
        warmupRuns: 3,
        measurementRuns: 10,
        timeout: 300000,
        memoryProfiling: true,
        outputFormat: 'json' as const
    }
};

// Performance thresholds for regression testing
export const PERFORMANCE_THRESHOLDS = {
    initialRender: {
        small: 50,    // 50ms for 100x10 grid
        medium: 200,  // 200ms for 1000x20 grid  
        large: 1000   // 1000ms for 10000x50 grid
    },
    scrollPerformance: {
        small: 5,     // 5ms per scroll event
        medium: 10,   // 10ms per scroll event
        large: 20     // 20ms per scroll event
    },
    canvasDrawing: {
        small: 10,    // 10ms for 100 cells
        medium: 50,   // 50ms for 1000 cells
        large: 200    // 200ms for 10000 cells
    },
    memoryUsage: {
        small: 5 * 1024 * 1024,    // 5MB
        medium: 20 * 1024 * 1024,  // 20MB
        large: 100 * 1024 * 1024   // 100MB
    }
};