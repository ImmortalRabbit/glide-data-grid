#!/bin/bash

# Performance Testing Script for CI/CD
set -e

echo "🔥 Data Grid Performance Testing Suite"
echo "======================================"

# Configuration
RESULTS_DIR="test-results/performance"
BASELINE_FILE="$RESULTS_DIR/baseline.json"
THRESHOLD_REGRESSION=20  # Fail if performance regresses by more than 20%

# Create results directory
mkdir -p "$RESULTS_DIR"

# Check if we're running in CI
if [ "$CI" = "true" ]; then
    echo "🤖 Running in CI environment"
    PERFORMANCE_MODE="quick"
else
    echo "🏠 Running in local environment"
    PERFORMANCE_MODE="standard"
fi

# Function to run performance tests
run_performance_tests() {
    local mode=$1
    echo "📊 Running performance tests in $mode mode..."
    
    case $mode in
        "quick")
            npm run test:perf-quick
            ;;
        "standard")
            npm run test:perf
            ;;
        "comprehensive")
            npm run test:perf-comprehensive
            ;;
        *)
            echo "❌ Unknown performance mode: $mode"
            exit 1
            ;;
    esac
}

# Function to check for performance regressions
check_regressions() {
    local comparison_file="$RESULTS_DIR/latest-comparison.json"
    
    if [ ! -f "$comparison_file" ]; then
        echo "⚠️  No comparison data available"
        return 0
    fi
    
    echo "🔍 Checking for performance regressions..."
    
    # Use Node.js to parse JSON and check for regressions
    node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync('$comparison_file', 'utf-8'));
        const regressions = Object.entries(data.comparison).filter(
            ([_, value]) => value.status === 'regressed' && value.improvement < -$THRESHOLD_REGRESSION
        );
        
        if (regressions.length > 0) {
            console.log('❌ Performance regressions detected:');
            regressions.forEach(([metric, data]) => {
                console.log(\`   \${metric}: \${data.improvement.toFixed(1)}% slower\`);
            });
            process.exit(1);
        } else {
            console.log('✅ No significant performance regressions detected');
        }
    "
}

# Function to upload results (placeholder for actual implementation)
upload_results() {
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local results_file="$RESULTS_DIR/results-$timestamp.json"
    
    if [ -f "$results_file" ]; then
        echo "📤 Results available at: $results_file"
        
        # Uncomment and modify based on your CI system:
        # - GitHub Actions: Upload as artifact
        # - GitLab CI: Upload as artifact
        # - Jenkins: Archive artifacts
        # - Custom: Upload to S3/GCS/etc.
        
        # Example for GitHub Actions:
        # echo "::set-output name=performance-results::$results_file"
        
        # Example for uploading to a service:
        # curl -X POST "https://your-performance-service.com/upload" \
        #   -H "Authorization: Bearer $PERF_API_TOKEN" \
        #   -F "file=@$results_file" \
        #   -F "project=glide-data-grid-fork" \
        #   -F "branch=$CI_BRANCH" \
        #   -F "commit=$CI_COMMIT_SHA"
    fi
}

# Function to generate performance badge
generate_badge() {
    local latest_file=$(ls -t $RESULTS_DIR/results-*.json 2>/dev/null | head -n1)
    
    if [ -f "$latest_file" ]; then
        echo "🏆 Generating performance badge..."
        
        # Extract key metrics for badge
        node -e "
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync('$latest_file', 'utf-8'));
            
            // Calculate overall performance score
            const renderTime = data.benchmarks.mediumDatasetRender?.renderTime || 0;
            const scrollTime = data.benchmarks.mediumDatasetScroll || 0;
            
            let color = 'red';
            let status = 'poor';
            
            if (renderTime < 100 && scrollTime < 5) {
                color = 'brightgreen';
                status = 'excellent';
            } else if (renderTime < 200 && scrollTime < 10) {
                color = 'green';
                status = 'good';
            } else if (renderTime < 500 && scrollTime < 20) {
                color = 'yellow';
                status = 'fair';
            }
            
            console.log(\`Performance: \${status} (render: \${renderTime.toFixed(0)}ms, scroll: \${scrollTime.toFixed(1)}ms)\`);
            
            // Generate badge URL (shields.io format)
            const badgeUrl = \`https://img.shields.io/badge/Performance-\${status}-\${color}?style=flat-square\`;
            console.log(\`Badge URL: \${badgeUrl}\`);
            
            // Save badge info
            fs.writeFileSync('$RESULTS_DIR/badge.json', JSON.stringify({
                status,
                color,
                url: badgeUrl,
                timestamp: new Date().toISOString()
            }, null, 2));
        "
    fi
}

# Main execution
main() {
    echo "🚀 Starting performance test suite..."
    
    # Run the performance tests
    run_performance_tests "$PERFORMANCE_MODE"
    
    # Check for regressions (will exit with code 1 if found)
    check_regressions
    
    # Upload results if in CI
    if [ "$CI" = "true" ]; then
        upload_results
    fi
    
    # Generate performance badge
    generate_badge
    
    echo "✅ Performance testing completed successfully!"
}

# Handle script arguments
case "${1:-}" in
    "quick")
        PERFORMANCE_MODE="quick"
        main
        ;;
    "standard")
        PERFORMANCE_MODE="standard"
        main
        ;;
    "comprehensive")
        PERFORMANCE_MODE="comprehensive"
        main
        ;;
    "check-only")
        check_regressions
        ;;
    "badge-only")
        generate_badge
        ;;
    *)
        main
        ;;
esac