import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DataGridBenchmarks, BENCHMARK_CONFIGS, PERFORMANCE_THRESHOLDS } from './data-grid-benchmarks.js';
import { PerformanceReporter } from './performance-framework.js';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Data Grid Performance Tests', () => {
    let benchmarks: DataGridBenchmarks;
    let baselineResults: Record<string, any> | null = null;
    const resultsDir = path.join(process.cwd(), 'test-results', 'performance');

    beforeAll(async () => {
        benchmarks = new DataGridBenchmarks();
        
        // Create results directory
        await fs.mkdir(resultsDir, { recursive: true });
        
        // Try to load baseline results
        try {
            const baselinePath = path.join(resultsDir, 'baseline.json');
            const baselineData = await fs.readFile(baselinePath, 'utf-8');
            baselineResults = JSON.parse(baselineData);
            console.log('📊 Loaded baseline performance data');
        } catch {
            console.log('⚠️  No baseline data found - this will become the baseline');
        }
    });

    afterAll(async () => {
        // Save results for future comparisons
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const resultsPath = path.join(resultsDir, `results-${timestamp}.json`);
        
        // Run full benchmark suite for final results
        const fullResults = await benchmarks.runFullBenchmarkSuite();
        await fs.writeFile(resultsPath, JSON.stringify(fullResults, null, 2));
        
        // Update baseline if none exists
        if (!baselineResults) {
            const baselinePath = path.join(resultsDir, 'baseline.json');
            await fs.writeFile(baselinePath, JSON.stringify(fullResults, null, 2));
            console.log('📝 Saved new baseline performance data');
        }
        
        console.log(`💾 Performance results saved to: ${resultsPath}`);
    });

    describe('Render Performance', () => {
        it('should render small datasets within threshold', async () => {
            const result = await benchmarks.benchmarkInitialRender(100, 10);
            
            expect(result.renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.initialRender.small);
            expect(result.memoryUsage).toBeLessThan(PERFORMANCE_THRESHOLDS.memoryUsage.small);
            
            console.log(`✅ Small dataset render: ${result.renderTime.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.initialRender.small}ms)`);
        }, 30000);

        it('should render medium datasets within threshold', async () => {
            const result = await benchmarks.benchmarkInitialRender(1000, 20);
            
            expect(result.renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.initialRender.medium);
            expect(result.memoryUsage).toBeLessThan(PERFORMANCE_THRESHOLDS.memoryUsage.medium);
            
            console.log(`✅ Medium dataset render: ${result.renderTime.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.initialRender.medium}ms)`);
        }, 60000);

        it('should render large datasets within threshold', async () => {
            const result = await benchmarks.benchmarkInitialRender(10000, 50);
            
            expect(result.renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.initialRender.large);
            expect(result.memoryUsage).toBeLessThan(PERFORMANCE_THRESHOLDS.memoryUsage.large);
            
            console.log(`✅ Large dataset render: ${result.renderTime.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.initialRender.large}ms)`);
        }, 120000);
    });

    describe('Scrolling Performance', () => {
        it('should scroll smoothly with small datasets', async () => {
            const avgScrollTime = await benchmarks.benchmarkScrollPerformance(100);
            
            expect(avgScrollTime).toBeLessThan(PERFORMANCE_THRESHOLDS.scrollPerformance.small);
            
            console.log(`✅ Small dataset scroll: ${avgScrollTime.toFixed(2)}ms per event (threshold: ${PERFORMANCE_THRESHOLDS.scrollPerformance.small}ms)`);
        });

        it('should scroll smoothly with medium datasets', async () => {
            const avgScrollTime = await benchmarks.benchmarkScrollPerformance(1000);
            
            expect(avgScrollTime).toBeLessThan(PERFORMANCE_THRESHOLDS.scrollPerformance.medium);
            
            console.log(`✅ Medium dataset scroll: ${avgScrollTime.toFixed(2)}ms per event (threshold: ${PERFORMANCE_THRESHOLDS.scrollPerformance.medium}ms)`);
        });

        it('should scroll smoothly with large datasets', async () => {
            const avgScrollTime = await benchmarks.benchmarkScrollPerformance(10000);
            
            expect(avgScrollTime).toBeLessThan(PERFORMANCE_THRESHOLDS.scrollPerformance.large);
            
            console.log(`✅ Large dataset scroll: ${avgScrollTime.toFixed(2)}ms per event (threshold: ${PERFORMANCE_THRESHOLDS.scrollPerformance.large}ms)`);
        });
    });

    describe('Canvas Drawing Performance', () => {
        it('should draw small cell counts efficiently', async () => {
            const drawTime = await benchmarks.benchmarkCanvasDrawing(100);
            
            expect(drawTime).toBeLessThan(PERFORMANCE_THRESHOLDS.canvasDrawing.small);
            
            console.log(`✅ Small canvas draw: ${drawTime.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.canvasDrawing.small}ms)`);
        });

        it('should draw medium cell counts efficiently', async () => {
            const drawTime = await benchmarks.benchmarkCanvasDrawing(1000);
            
            expect(drawTime).toBeLessThan(PERFORMANCE_THRESHOLDS.canvasDrawing.medium);
            
            console.log(`✅ Medium canvas draw: ${drawTime.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.canvasDrawing.medium}ms)`);
        });

        it('should draw large cell counts efficiently', async () => {
            const drawTime = await benchmarks.benchmarkCanvasDrawing(10000);
            
            expect(drawTime).toBeLessThan(PERFORMANCE_THRESHOLDS.canvasDrawing.large);
            
            console.log(`✅ Large canvas draw: ${drawTime.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.canvasDrawing.large}ms)`);
        });
    });

    describe('Interaction Performance', () => {
        it('should handle cell selections efficiently', async () => {
            const avgSelectionTime = await benchmarks.benchmarkCellSelection(1000, 20);
            
            // Expect selection to be under 10ms per operation
            expect(avgSelectionTime).toBeLessThan(10);
            
            console.log(`✅ Cell selection: ${avgSelectionTime.toFixed(2)}ms per selection`);
        });

        it('should handle virtual scrolling efficiently', async () => {
            const virtualScrollTime = await benchmarks.benchmarkVirtualScrolling(10000);
            
            // Virtual scrolling should be fast even with large datasets
            expect(virtualScrollTime).toBeLessThan(500);
            
            console.log(`✅ Virtual scrolling: ${virtualScrollTime.toFixed(2)}ms for 10k rows`);
        });
    });

    describe('Regression Testing', () => {
        it('should not regress significantly from baseline', async () => {
            if (!baselineResults) {
                console.log('⚠️  Skipping regression test - no baseline available');
                return;
            }

            // Run a quick benchmark suite
            const currentResults = await benchmarks.runFullBenchmarkSuite();
            
            // Compare with baseline
            const comparison = PerformanceReporter.compareResults(
                currentResults.detailed,
                baselineResults.detailed
            );
            
            // Generate report
            const report = PerformanceReporter.generateReport(
                currentResults.detailed,
                comparison
            );
            
            console.log('\n📊 Performance Comparison Report:');
            console.log(report);
            
            // Check for significant regressions
            const regressions = Object.entries(comparison).filter(
                ([_, data]: [string, any]) => data.status === 'regressed' && data.improvement < -20
            );
            
            if (regressions.length > 0) {
                const regressionDetails = regressions.map(
                    ([metric, data]) => `${metric}: ${data.improvement.toFixed(1)}% slower`
                ).join(', ');
                
                console.warn(`⚠️  Performance regressions detected: ${regressionDetails}`);
                
                // Fail test if regressions are severe (>50% slower)
                const severeRegressions = regressions.filter(
                    ([_, data]: [string, any]) => data.improvement < -50
                );
                
                expect(severeRegressions.length).toBe(0);
            }
            
            // Save comparison results
            const comparisonPath = path.join(resultsDir, 'latest-comparison.json');
            await fs.writeFile(comparisonPath, JSON.stringify({
                comparison,
                report,
                timestamp: new Date().toISOString()
            }, null, 2));
        }, 300000); // 5 minute timeout for comprehensive testing
    });
});

// Additional utility test for manual performance analysis
describe('Manual Performance Analysis', () => {
    it.skip('should run comprehensive benchmark suite', async () => {
        const benchmarks = new DataGridBenchmarks();
        const results = await benchmarks.runFullBenchmarkSuite();
        
        console.log('\n🔥 Comprehensive Performance Results:');
        console.log(JSON.stringify(results, null, 2));
        
        // This test is skipped by default but can be run manually
        // to get detailed performance metrics
    }, 600000); // 10 minute timeout
});