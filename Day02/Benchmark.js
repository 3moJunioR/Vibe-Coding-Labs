// =============================================================
// TASK 8: Performance Benchmark — QuickSort vs Array.sort()
// =============================================================
//
// This benchmark compares:
//   1. Custom Recursive QuickSort
//   2. Custom Randomized QuickSort
//   3. Custom Tail-Optimized QuickSort
//   4. Built-in Array.prototype.sort() (uses Timsort in V8)
//
// Uses performance.now() for accurate timing.
// Tests across different array sizes and data patterns.
//
// HOW TO RUN:
//   node Benchmark.js
// =============================================================

/**
 * Performance benchmark runner for QuickSort variants vs Array.sort().
 */

// Fixed‐seed PRNG (mulberry32) for reproducibility
function seededRandom(seed) {
    let s = seed;
    return function () {
        s |= 0;
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const _random = seededRandom(42);

// ──────────────────────────────────────────────────────────
// QuickSort Implementations (Self-Contained for Benchmark)
// ──────────────────────────────────────────────────────────

function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function partition(array, left, right) {
    const pivot = array[right];
    let idx = left - 1;
    for (let j = left; j < right; j++) {
        if (array[j] < pivot) {
            idx++;
            swap(array, idx, j);
        }
    }
    swap(array, idx + 1, right);
    return idx + 1;
}

/** Standard recursive QuickSort (last element pivot). */
function recursiveQuickSort(array, left, right) {
    if (left < right) {
        const pivot = partition(array, left, right);
        recursiveQuickSort(array, left, pivot - 1);
        recursiveQuickSort(array, pivot + 1, right);
    }
}

/** Randomized pivot QuickSort (avoids worst case on sorted input). */
function randomizedQuickSort(array, left, right) {
    if (left < right) {
        const pivotIdx = left + Math.floor(Math.random() * (right - left + 1));
        swap(array, pivotIdx, right);

        const pivot = partition(array, left, right);
        randomizedQuickSort(array, left, pivot - 1);
        randomizedQuickSort(array, pivot + 1, right);
    }
}

/** Tail-optimized QuickSort. Minimizes stack depth to O(log n). */
function tailOptimizedQuickSort(array, left, right) {
    while (left < right) {
        const pivot = partition(array, left, right);

        // Recurse on smaller partition, iterate on larger
        if (pivot - left < right - pivot) {
            tailOptimizedQuickSort(array, left, pivot - 1);
            left = pivot + 1;
        } else {
            tailOptimizedQuickSort(array, pivot + 1, right);
            right = pivot - 1;
        }
    }
}

// ──────────────────────────────────────────────────────────
// Array Generators
// ──────────────────────────────────────────────────────────

function generateRandomArray(size) {
    const rand = seededRandom(42);
    return Array.from({ length: size }, () =>
        Math.floor(rand() * 4294967296) - 2147483648
    );
}

// ──────────────────────────────────────────────────────────
// Benchmark Helpers
// ──────────────────────────────────────────────────────────

function benchmarkAlgorithm(name, original, sortFn) {
    // Clone the array so each test starts with the same unsorted data
    const testArray = [...original];

    // Warm up (avoid JIT compilation affecting first result)
    const warmup = original.slice(0, 100);
    sortFn([...warmup]);

    // Actual timing
    const start = performance.now();
    sortFn(testArray);
    const elapsed = performance.now() - start;

    const ms = elapsed.toFixed(3);
    const us = (elapsed * 1000).toFixed(0);

    console.log(`  ${name.padEnd(33)} ${ms.padStart(10)} ${us.padStart(12)}`);
}

function benchmarkPattern(pattern, original, sortFn, algName) {
    const testArray = [...original];

    const start = performance.now();
    sortFn(testArray);
    const elapsed = performance.now() - start;

    const ms = elapsed.toFixed(3);
    console.log(`  ${pattern.padEnd(25)} ${algName.padEnd(30)} ${ms.padStart(10)}`);
}

// ──────────────────────────────────────────────────────────
// Benchmark Runs
// ──────────────────────────────────────────────────────────

function runBenchmarkForSize(size) {
    console.log(`\n🔢 Array Size: ${size.toLocaleString()}`);
    console.log('─'.repeat(65));
    console.log(`  ${'Algorithm'.padEnd(33)} ${'Time (ms)'.padStart(10)} ${'Time (μs)'.padStart(12)}`);
    console.log('─'.repeat(65));

    // Generate a random base array
    const baseArray = generateRandomArray(size);

    // Benchmark each algorithm
    benchmarkAlgorithm('Recursive QuickSort',      baseArray, arr => recursiveQuickSort(arr, 0, arr.length - 1));
    benchmarkAlgorithm('Randomized QuickSort',     baseArray, arr => randomizedQuickSort(arr, 0, arr.length - 1));
    benchmarkAlgorithm('Tail-Optimized QuickSort', baseArray, arr => tailOptimizedQuickSort(arr, 0, arr.length - 1));
    benchmarkAlgorithm('Built-in Array.sort()',    baseArray, arr => arr.sort((a, b) => a - b));

    console.log('─'.repeat(65));
}

function runPatternBenchmarks(size) {
    console.log(`\n${'Pattern'.padEnd(25)} ${'Algorithm'.padEnd(30)} ${'Time (ms)'.padStart(10)}`);
    console.log('─'.repeat(70));

    // Already Sorted
    const sorted = Array.from({ length: size }, (_, i) => i + 1);
    benchmarkPattern('Already Sorted', sorted, arr => randomizedQuickSort(arr, 0, arr.length - 1), 'Randomized QuickSort');
    benchmarkPattern('Already Sorted', sorted, arr => arr.sort((a, b) => a - b), 'Array.sort()');

    console.log();

    // Reverse Sorted
    const reversed = Array.from({ length: size }, (_, i) => size - i);
    benchmarkPattern('Reverse Sorted', reversed, arr => randomizedQuickSort(arr, 0, arr.length - 1), 'Randomized QuickSort');
    benchmarkPattern('Reverse Sorted', reversed, arr => arr.sort((a, b) => a - b), 'Array.sort()');

    console.log();

    // All Same
    const allSame = Array.from({ length: size }, () => 42);
    benchmarkPattern('All Same Values', allSame, arr => randomizedQuickSort(arr, 0, arr.length - 1), 'Randomized QuickSort');
    benchmarkPattern('All Same Values', allSame, arr => arr.sort((a, b) => a - b), 'Array.sort()');
}

// ──────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────

function main() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║          QuickSort Performance Benchmark (JavaScript)       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log();

    const sizes = [1_000, 10_000, 100_000, 500_000];

    for (const size of sizes) {
        runBenchmarkForSize(size);
    }

    console.log('\n📊 Additional Pattern Benchmarks (size = 100,000)');
    console.log('─'.repeat(65));
    runPatternBenchmarks(100_000);

    console.log('\n✅ Benchmark complete!');
}

/*
═══════════════════════════════════════════════════════════
EXPECTED BENCHMARK RESULTS (approximate, on modern hardware)
═══════════════════════════════════════════════════════════

Array Size: 100,000 elements
─────────────────────────────────────────────────────────────────
Algorithm                           Time (ms)      Time (μs)
─────────────────────────────────────────────────────────────────
  Recursive QuickSort                  20-40 ms      20000-40000
  Randomized QuickSort                 25-45 ms      25000-45000
  Tail-Optimized QuickSort             20-38 ms      20000-38000
  Built-in Array.sort()                15-25 ms      15000-25000
─────────────────────────────────────────────────────────────────

NOTES:
- Array.sort() in V8 uses Timsort, which is a hybrid merge+insertion sort.
  Timsort is highly optimized for real-world data with partial ordering.
- Randomized QuickSort is slightly slower on random data (RNG overhead),
  BUT avoids worst-case O(n²) on sorted data unlike basic recursive.
- Tail-Optimized QuickSort has the same speed but uses less call stack.
- NOTE: Recursive QuickSort on "Already Sorted" input is excluded because
  it will hit stack overflow (O(n) recursion depth) for 100k elements.
  Use Randomized or Tail-Optimized variants for sorted/reversed data.

WHY Array.sort() IS FASTER:
  1. Native (compiled) code, heavily optimized by the V8 engine
  2. Timsort exploits existing order in the data (natural runs)
  3. Uses binary insertion sort for small runs
  4. Fully inlined hot paths — no JS function call overhead in inner loop
*/

// Run directly: node Benchmark.js
main();
