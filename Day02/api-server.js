/**
 * REST API for Sorting Algorithms
 * Exposes QuickSort and other sorting algorithms via HTTP endpoints.
 *
 * Endpoints:
 *   POST /api/sort           — Sort an array with a specified algorithm
 *   GET  /api/algorithms     — List all available algorithms
 *   GET  /api/health         — Health check
 *
 * Usage:
 *   npm install express cors
 *   node api-server.js
 *   Then visit http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve the visualizer HTML
app.use(express.static(path.join(__dirname)));

// ===================================================
// Sorting Algorithm Implementations
// ===================================================

function quickSort(arr) {
    const a = [...arr];
    let comparisons = 0, swaps = 0;
    function qs(lo, hi) {
        if (lo >= hi) return;
        let pivot = a[hi], idx = lo;
        for (let i = lo; i < hi; i++) {
            comparisons++;
            if (a[i] < pivot) { [a[i], a[idx]] = [a[idx], a[i]]; swaps++; idx++; }
        }
        [a[idx], a[hi]] = [a[hi], a[idx]]; swaps++;
        qs(lo, idx - 1);
        qs(idx + 1, hi);
    }
    qs(0, a.length - 1);
    return { sorted: a, comparisons, swaps };
}

function mergeSort(arr) {
    const a = [...arr];
    let comparisons = 0, swaps = 0;
    function ms(lo, hi) {
        if (lo >= hi) return;
        const mid = (lo + hi) >> 1;
        ms(lo, mid);
        ms(mid + 1, hi);
        const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1);
        let i = 0, j = 0, k = lo;
        while (i < L.length && j < R.length) {
            comparisons++;
            if (L[i] <= R[j]) a[k++] = L[i++]; else a[k++] = R[j++];
            swaps++;
        }
        while (i < L.length) { a[k++] = L[i++]; swaps++; }
        while (j < R.length) { a[k++] = R[j++]; swaps++; }
    }
    ms(0, a.length - 1);
    return { sorted: a, comparisons, swaps };
}

function bubbleSort(arr) {
    const a = [...arr];
    let comparisons = 0, swaps = 0;
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            comparisons++;
            if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; }
        }
    }
    return { sorted: a, comparisons, swaps };
}

function insertionSort(arr) {
    const a = [...arr];
    let comparisons = 0, swaps = 0;
    for (let i = 1; i < a.length; i++) {
        let j = i;
        while (j > 0) {
            comparisons++;
            if (a[j] < a[j - 1]) { [a[j], a[j - 1]] = [a[j - 1], a[j]]; swaps++; j--; }
            else break;
        }
    }
    return { sorted: a, comparisons, swaps };
}

function selectionSort(arr) {
    const a = [...arr];
    let comparisons = 0, swaps = 0;
    for (let i = 0; i < a.length - 1; i++) {
        let m = i;
        for (let j = i + 1; j < a.length; j++) { comparisons++; if (a[j] < a[m]) m = j; }
        if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; swaps++; }
    }
    return { sorted: a, comparisons, swaps };
}

function heapSort(arr) {
    const a = [...arr];
    let comparisons = 0, swaps = 0;
    function sift(n, i) {
        let lg = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n) { comparisons++; if (a[l] > a[lg]) lg = l; }
        if (r < n) { comparisons++; if (a[r] > a[lg]) lg = r; }
        if (lg !== i) { [a[i], a[lg]] = [a[lg], a[i]]; swaps++; sift(n, lg); }
    }
    const n = a.length;
    for (let i = (n >> 1) - 1; i >= 0; i--) sift(n, i);
    for (let i = n - 1; i > 0; i--) { [a[0], a[i]] = [a[i], a[0]]; swaps++; sift(i, 0); }
    return { sorted: a, comparisons, swaps };
}

// Parallel QuickSort using Worker Threads
function parallelQuickSort(arr) {
    return new Promise((resolve) => {
        const a = [...arr];
        const numChunks = Math.min(4, Math.max(1, Math.floor(a.length / 50)));

        if (numChunks <= 1) {
            resolve(quickSort(arr));
            return;
        }

        const chunkSize = Math.ceil(a.length / numChunks);
        const chunks = [];
        for (let i = 0; i < a.length; i += chunkSize) chunks.push(a.slice(i, i + chunkSize));

        let completed = 0;
        const sortedChunks = new Array(chunks.length);
        let totalComps = 0, totalSwaps = 0;

        chunks.forEach((chunk, idx) => {
            const worker = new Worker(__filename, { workerData: { chunk } });
            worker.on('message', (msg) => {
                sortedChunks[idx] = msg.sorted;
                totalComps += msg.comparisons;
                totalSwaps += msg.swaps;
                completed++;
                if (completed === chunks.length) {
                    // k-way merge
                    const merged = kWayMerge(sortedChunks);
                    resolve({ sorted: merged, comparisons: totalComps, swaps: totalSwaps });
                }
            });
            worker.on('error', () => {
                // Fallback to single-threaded
                resolve(quickSort(arr));
            });
        });
    });
}

function kWayMerge(arrays) {
    const result = [];
    const ptrs = arrays.map(() => 0);
    const total = arrays.reduce((s, a) => s + a.length, 0);
    while (result.length < total) {
        let minVal = Infinity, minIdx = -1;
        for (let i = 0; i < arrays.length; i++) {
            if (ptrs[i] < arrays[i].length && arrays[i][ptrs[i]] < minVal) {
                minVal = arrays[i][ptrs[i]]; minIdx = i;
            }
        }
        result.push(minVal);
        ptrs[minIdx]++;
    }
    return result;
}

// Worker thread handler
if (!isMainThread && workerData) {
    const result = quickSort(workerData.chunk);
    parentPort.postMessage(result);
    process.exit(0);
}

// Algorithm registry
const ALGORITHMS = {
    quicksort:     { name: 'QuickSort',          fn: quickSort,     async: false, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' },
    mergesort:     { name: 'MergeSort',          fn: mergeSort,     async: false, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
    bubblesort:    { name: 'BubbleSort',         fn: bubbleSort,    async: false, best: 'O(n)',       avg: 'O(n²)',      worst: 'O(n²)' },
    insertionsort: { name: 'InsertionSort',      fn: insertionSort, async: false, best: 'O(n)',       avg: 'O(n²)',      worst: 'O(n²)' },
    selectionsort: { name: 'SelectionSort',      fn: selectionSort, async: false, best: 'O(n²)',      avg: 'O(n²)',      worst: 'O(n²)' },
    heapsort:      { name: 'HeapSort',           fn: heapSort,      async: false, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
    parallelsort:  { name: 'Parallel QuickSort', fn: parallelQuickSort, async: true, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' },
};

// ===================================================
// API Routes
// ===================================================

/** GET /api/health */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

/** GET /api/algorithms — list available algorithms */
app.get('/api/algorithms', (req, res) => {
    const list = Object.entries(ALGORITHMS).map(([key, val]) => ({
        id: key, name: val.name, best: val.best, average: val.avg, worst: val.worst
    }));
    res.json({ algorithms: list });
});

/**
 * POST /api/sort
 * Body: { "array": [5,3,8,1,2], "algorithm": "quicksort" }
 * Response: { "original": [...], "sorted": [...], "algorithm": "...", "stats": {...} }
 */
app.post('/api/sort', async (req, res) => {
    try {
        const { array, algorithm = 'quicksort' } = req.body;

        // Validate input
        if (!array || !Array.isArray(array)) {
            return res.status(400).json({ error: 'Please provide an "array" field with an array of numbers.' });
        }
        if (array.length === 0) {
            return res.status(400).json({ error: 'Array must not be empty.' });
        }
        if (array.length > 100000) {
            return res.status(400).json({ error: 'Array size must be <= 100,000.' });
        }
        const nums = array.map(Number);
        if (nums.some(isNaN)) {
            return res.status(400).json({ error: 'All array elements must be valid numbers.' });
        }

        const algoKey = algorithm.toLowerCase().replace(/[^a-z]/g, '');
        const algoEntry = ALGORITHMS[algoKey];
        if (!algoEntry) {
            return res.status(400).json({
                error: `Unknown algorithm "${algorithm}". Available: ${Object.keys(ALGORITHMS).join(', ')}`
            });
        }

        const t0 = performance.now();
        let result;
        if (algoEntry.async) {
            result = await algoEntry.fn(nums);
        } else {
            result = algoEntry.fn(nums);
        }
        const elapsed = (performance.now() - t0).toFixed(3);

        res.json({
            original: nums,
            sorted: result.sorted,
            algorithm: algoEntry.name,
            stats: {
                arraySize: nums.length,
                comparisons: result.comparisons,
                swaps: result.swaps,
                executionTimeMs: parseFloat(elapsed),
                complexity: { best: algoEntry.best, average: algoEntry.avg, worst: algoEntry.worst }
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
});

// Serve visualizer at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorting-bonus.html'));
});

// ===================================================
// Start Server
// ===================================================
if (isMainThread) {
    app.listen(PORT, () => {
        console.log(`\n  ⚡ Sorting API Server running at http://localhost:${PORT}`);
        console.log(`  📊 Visualizer:  http://localhost:${PORT}/`);
        console.log(`  🔌 API Docs:`);
        console.log(`     GET  /api/health`);
        console.log(`     GET  /api/algorithms`);
        console.log(`     POST /api/sort  { "array": [5,3,1], "algorithm": "quicksort" }\n`);
    });
}
