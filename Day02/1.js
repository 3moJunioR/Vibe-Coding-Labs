// =============================================================
// QuickSort Implementations in JavaScript
// Converted from C# (1.cs)
// =============================================================

/**
 * Generic QuickSort implementation that works with any comparable values.
 * Uses a custom comparator function for flexibility.
 */
class GenericQuickSort {
    /**
     * Sorts an array in ascending order using the QuickSort algorithm.
     * @param {Array} array - The array to be sorted.
     * @param {Function} [compareFn] - Optional comparator (default: ascending numeric/string).
     */
    static sort(array, compareFn = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
        if (!array || array.length === 0) return;
        GenericQuickSort.#quickSortRecursive(array, 0, array.length - 1, compareFn);
    }

    static #quickSortRecursive(array, leftBound, rightBound, compareFn) {
        if (leftBound < rightBound) {
            const pivotIndex = GenericQuickSort.#partition(array, leftBound, rightBound, compareFn);
            GenericQuickSort.#quickSortRecursive(array, leftBound, pivotIndex - 1, compareFn);
            GenericQuickSort.#quickSortRecursive(array, pivotIndex + 1, rightBound, compareFn);
        }
    }

    static #partition(array, leftBound, rightBound, compareFn) {
        const pivot = array[rightBound];
        let indexOfSmaller = leftBound - 1;

        for (let currentIndex = leftBound; currentIndex < rightBound; currentIndex++) {
            if (compareFn(array[currentIndex], pivot) < 0) {
                indexOfSmaller++;
                GenericQuickSort.#swap(array, indexOfSmaller, currentIndex);
            }
        }

        GenericQuickSort.#swap(array, indexOfSmaller + 1, rightBound);
        return indexOfSmaller + 1;
    }

    static #swap(array, firstIndex, secondIndex) {
        const temp = array[firstIndex];
        array[firstIndex] = array[secondIndex];
        array[secondIndex] = temp;
    }
}

// =============================================================

/**
 * QuickSort Algorithm - Sorts an array by partitioning and recursively sorting partitions.
 */
class QuickSortAlgorithm {
    /**
     * PUBLIC ENTRY POINT - This is what users call to sort their array.
     * @param {number[]} array - The array to be sorted.
     */
    static sort(array) {
        // Safety check: Don't process null/undefined or empty arrays
        if (!array || array.length === 0) return;

        // Call the recursive helper function with the entire array
        // Parameters: (array, startIndex, endIndex)
        QuickSortAlgorithm.#quickSortRecursive(array, 0, array.length - 1);
    }

    /**
     * RECURSIVE HELPER - This method calls itself on smaller partitions.
     *
     * How recursion works here:
     * 1. Partition the array around a pivot
     * 2. Recursively sort the left partition (smaller elements)
     * 3. Recursively sort the right partition (larger elements)
     * 4. Stop when left >= right (partition size is 0 or 1)
     */
    static #quickSortRecursive(array, leftBound, rightBound) {
        // BASE CASE: If the partition has only 1 or fewer elements, it's already sorted
        // Stop the recursion here to avoid infinite loops
        if (leftBound < rightBound) {
            // STEP 1: Partition the array around a pivot
            // This returns the final position of the pivot element
            // After this, pivot is in its correct sorted position
            const pivotIndex = QuickSortAlgorithm.#partition(array, leftBound, rightBound);

            // STEP 2: Recursively sort the LEFT partition (smaller than pivot)
            // We sort from leftBound to (pivotIndex - 1)
            // We exclude the pivot itself because it's already in the right spot
            QuickSortAlgorithm.#quickSortRecursive(array, leftBound, pivotIndex - 1);

            // STEP 3: Recursively sort the RIGHT partition (larger than pivot)
            // We sort from (pivotIndex + 1) to rightBound
            // Again, we exclude the pivot
            QuickSortAlgorithm.#quickSortRecursive(array, pivotIndex + 1, rightBound);
        }
        // When the function returns, this partition is fully sorted
    }

    /**
     * PARTITIONING FUNCTION - Rearranges elements around a pivot.
     * This is the heart of QuickSort - it puts the pivot in its final position.
     *
     * Strategy: Use the last element as pivot, then move smaller elements left.
     * Example: [64, 34, 25, 12, 22, 11, 90, 88]
     * Pivot = 88 (last element)
     * Result: [64, 34, 25, 12, 22, 11, 88, 90]
     *          smaller than 88 | 88 | larger than 88
     */
    static #partition(array, leftBound, rightBound) {
        // SELECT PIVOT: Use the rightmost element as our reference point
        // (We could also pick random, middle, or first element)
        const pivot = array[rightBound];

        // INITIALIZE: This tracks the boundary between smaller and larger elements
        // indexOfSmaller points to the last element that is smaller than pivot
        // Everything to its left is smaller than pivot
        let indexOfSmaller = leftBound - 1;

        // SCAN: Go through each element from left to the second-to-last
        // (We skip the rightmost element because it's our pivot)
        for (let currentIndex = leftBound; currentIndex < rightBound; currentIndex++) {
            // CHECK: Is the current element smaller than the pivot?
            if (array[currentIndex] < pivot) {
                // YES - This element belongs on the left side
                // Move the boundary one position right
                indexOfSmaller++;

                // Swap the current element with the element at the boundary
                // This places the small element in the "left" section
                QuickSortAlgorithm.#swap(array, indexOfSmaller, currentIndex);
                // Example: if array was [12, 34, 25, 88] and we found 25 < 88
                //          we swap 34 and 25 to get [12, 25, 34, 88]
            }
            // If current element >= pivot, we don't swap
            // It naturally ends up in the right section
        }

        // FINALIZE: Place the pivot in its correct position
        // The pivot goes just after all the smaller elements
        QuickSortAlgorithm.#swap(array, indexOfSmaller + 1, rightBound);

        // RETURN: The final position of the pivot
        // This tells the caller where the pivot ended up
        // The pivot is now in its permanent sorted position!
        return indexOfSmaller + 1;
    }

    /**
     * UTILITY HELPER - Swaps two elements in the array.
     * This is used by Partition to rearrange elements.
     */
    static #swap(array, firstIndex, secondIndex) {
        // Store the first value in temporary storage
        const temp = array[firstIndex];

        // Copy the second value to the first position
        array[firstIndex] = array[secondIndex];

        // Copy the temporary value to the second position
        array[secondIndex] = temp;

        // Example: swap(arr, 0, 2) on [64, 34, 25]
        // Step 1: temp = 64
        // Step 2: arr[0] = 25  → [25, 34, 25]
        // Step 3: arr[2] = 64  → [25, 34, 64]
    }
}

// =============================================================

/**
 * Optimized QuickSort with randomized pivot selection.
 * Randomization prevents worst-case O(n²) on sorted arrays.
 */
class OptimizedQuickSort {
    /**
     * Entry point for sorting with randomized pivot selection.
     * @param {number[]} array - The array to be sorted.
     */
    static sort(array) {
        if (!array || array.length === 0) return;
        OptimizedQuickSort.#quickSortRecursive(array, 0, array.length - 1);
    }

    /**
     * Recursive QuickSort with randomized pivot selection.
     *
     * WHY RANDOMIZATION HELPS:
     * - Worst case occurs when pivot is always smallest/largest element
     * - This happens naturally with sorted arrays
     * - Random pivot eliminates this predictable bad case
     * - Expected time: O(n log n) even on sorted data
     */
    static #quickSortRecursive(array, left, right) {
        if (left < right) {
            // RANDOMIZED PIVOT: Select a random element in the partition
            // instead of always using the last element
            const randomPivotIndex = left + Math.floor(Math.random() * (right - left + 1));

            // Move random pivot to the end before partitioning
            OptimizedQuickSort.#swap(array, randomPivotIndex, right);

            // Partition around the pivot
            const pivotFinalPosition = OptimizedQuickSort.#partition(array, left, right);

            // Recursively sort left partition
            OptimizedQuickSort.#quickSortRecursive(array, left, pivotFinalPosition - 1);

            // Recursively sort right partition
            OptimizedQuickSort.#quickSortRecursive(array, pivotFinalPosition + 1, right);
        }
    }

    static #partition(array, left, right) {
        const pivot = array[right];
        let indexOfSmaller = left - 1;

        for (let i = left; i < right; i++) {
            if (array[i] < pivot) {
                indexOfSmaller++;
                OptimizedQuickSort.#swap(array, indexOfSmaller, i);
            }
        }

        OptimizedQuickSort.#swap(array, indexOfSmaller + 1, right);
        return indexOfSmaller + 1;
    }

    static #swap(array, i, j) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// =============================================================

/**
 * QuickSort with tail recursion optimization.
 *
 * TAIL RECURSION OPTIMIZATION EXPLAINED:
 * Normal recursion: Sort(left), then Sort(right) - uses stack for both
 * Tail optimized: Sort smaller partition recursively, iterate on larger
 *
 * This reduces maximum stack depth to O(log n) instead of O(n)
 * Prevents stack overflow on large nearly-sorted datasets
 */
class TailOptimizedQuickSort {
    /**
     * Sorts array using tail recursion optimization.
     * Dramatically reduces stack memory for large arrays.
     * @param {number[]} array - The array to be sorted.
     */
    static sort(array) {
        if (!array || array.length === 0) return;
        TailOptimizedQuickSort.#quickSortTailOptimized(array, 0, array.length - 1);
    }

    /**
     * Tail-optimized recursive QuickSort.
     *
     * Strategy:
     * 1. Partition the array
     * 2. Recursively sort the SMALLER partition
     * 3. Use iteration (while loop) for the LARGER partition
     *
     * Why: The smaller partition's recursion depth is limited.
     * The larger partition is handled iteratively, avoiding stack growth.
     */
    static #quickSortTailOptimized(array, left, right) {
        // Use a loop instead of recursion for the tail part
        while (left < right) {
            // Partition
            const pivotIndex = TailOptimizedQuickSort.#partition(array, left, right);

            // Check which partition is smaller
            if (pivotIndex - left < right - pivotIndex) {
                // LEFT partition is smaller
                // Recursively sort the left (smaller) partition
                TailOptimizedQuickSort.#quickSortTailOptimized(array, left, pivotIndex - 1);

                // Use iteration for the right (larger) partition
                // Instead of: quickSortTailOptimized(array, pivotIndex + 1, right);
                left = pivotIndex + 1;  // Move left pointer, loop continues
            } else {
                // RIGHT partition is smaller
                // Recursively sort the right (smaller) partition
                TailOptimizedQuickSort.#quickSortTailOptimized(array, pivotIndex + 1, right);

                // Use iteration for the left (larger) partition
                right = pivotIndex - 1;  // Move right pointer, loop continues
            }
        }
    }

    static #partition(array, left, right) {
        const pivot = array[right];
        let indexOfSmaller = left - 1;

        for (let i = left; i < right; i++) {
            if (array[i] < pivot) {
                indexOfSmaller++;
                TailOptimizedQuickSort.#swap(array, indexOfSmaller, i);
            }
        }

        TailOptimizedQuickSort.#swap(array, indexOfSmaller + 1, right);
        return indexOfSmaller + 1;
    }

    static #swap(array, i, j) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// =============================================================

/**
 * QuickSort with 3-way partitioning (Bentley-McIlroy QuickSort).
 *
 * OPTIMIZED FOR ARRAYS WITH MANY DUPLICATES:
 * - Regular 2-way: O(n²) when array is all same values
 * - 3-way: O(n) when array is all same values
 *
 * Strategy:
 * Partitions into THREE regions:
 * 1. Elements < pivot (left)
 * 2. Elements = pivot (middle) - already in final position!
 * 3. Elements > pivot (right)
 */
class ThreeWayQuickSort {
    static sort(array) {
        if (!array || array.length === 0) return;
        ThreeWayQuickSort.#quickSort3Way(array, 0, array.length - 1);
    }

    /**
     * 3-way partitioning QuickSort.
     * Much more efficient when there are many duplicate values.
     */
    static #quickSort3Way(array, left, right) {
        if (left < right) {
            // Random pivot to avoid worst case
            const randomIndex = left + Math.floor(Math.random() * (right - left + 1));
            ThreeWayQuickSort.#swap(array, randomIndex, right);

            // Perform 3-way partition
            // Returns two values: where equals region starts and ends
            const [eqLeft, eqRight] = ThreeWayQuickSort.#partition3Way(array, left, right);

            // Recursively sort the less-than region
            ThreeWayQuickSort.#quickSort3Way(array, left, eqLeft - 1);

            // Recursively sort the greater-than region
            // (Elements equal to pivot are already in final position!)
            ThreeWayQuickSort.#quickSort3Way(array, eqRight + 1, right);
        }
    }

    /**
     * 3-way partition: splits into <pivot, =pivot, >pivot regions.
     * @returns {[number, number]} [eqLeft, eqRight] boundaries of the equals region.
     */
    static #partition3Way(array, left, right) {
        const pivot = array[right];
        let lt = left;        // Points to last element < pivot
        let gt = right - 1;   // Points to first element > pivot
        let i = left;         // Current scanning position

        while (i <= gt) {
            if (array[i] < pivot) {
                // Element is less than pivot, move to left section
                ThreeWayQuickSort.#swap(array, i, lt);
                lt++;
                i++;
            } else if (array[i] > pivot) {
                // Element is greater than pivot, move to right section
                ThreeWayQuickSort.#swap(array, i, gt);
                gt--;
                // Don't increment i, we need to check the swapped element
            } else {
                // Element equals pivot, leave it in the middle
                i++;
            }
        }

        // Place pivot between equals regions
        ThreeWayQuickSort.#swap(array, right, gt + 1);

        // Return the boundaries of the equals region
        return [lt, gt + 1];
    }

    static #swap(array, i, j) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// =============================================================

/**
 * Iterative (non-recursive) QuickSort using an explicit stack.
 *
 * WHY ITERATIVE?
 * - Avoids call-stack overflow on very large arrays
 * - No function call overhead — can be slightly faster
 * - Still O(n log n) average; simulates recursion with a manual stack
 */
class IterativeQuickSort {
    /**
     * Sorts array iteratively using an explicit stack instead of recursion.
     * @param {number[]} array - The array to be sorted.
     */
    static sort(array) {
        if (!array || array.length < 2) return;

        let left = 0;
        let right = array.length - 1;

        // Use an explicit stack to simulate recursive calls
        // Each stack entry is a (left, right) pair representing a subarray to sort
        const stack = [];

        // Push the initial bounds onto the stack
        stack.push(left);
        stack.push(right);

        // Process the stack until empty (like unwinding recursive calls)
        while (stack.length > 0) {
            // Pop the right and left bounds
            right = stack.pop();
            left = stack.pop();

            // Partition the subarray and get the pivot's final position
            const pivotIndex = IterativeQuickSort.#partition(array, left, right);

            // If there are elements on the LEFT of pivot, push to stack
            if (pivotIndex - 1 > left) {
                stack.push(left);
                stack.push(pivotIndex - 1);
            }

            // If there are elements on the RIGHT of pivot, push to stack
            if (pivotIndex + 1 < right) {
                stack.push(pivotIndex + 1);
                stack.push(right);
            }
        }
    }

    static #partition(array, left, right) {
        const pivot = array[right];
        let indexOfSmaller = left - 1;

        for (let i = left; i < right; i++) {
            if (array[i] <= pivot) {
                indexOfSmaller++;
                IterativeQuickSort.#swap(array, indexOfSmaller, i);
            }
        }

        IterativeQuickSort.#swap(array, indexOfSmaller + 1, right);
        return indexOfSmaller + 1;
    }

    static #swap(array, i, j) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// ──────────────────────────────────────────────────────────────
// Helper functions for the benchmark below
// ──────────────────────────────────────────────────────────────

/**
 * Seeded pseudo-random number generator (for reproducible benchmarks).
 * Uses a simple mulberry32 algorithm.
 */
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

function generateLargeArray(size) {
    const rand = seededRandom(42);
    return Array.from({ length: size }, () => Math.floor(rand() * 2147483647));
}

function generateArrayWithDuplicates(size) {
    const rand = seededRandom(42);
    return Array.from({ length: size }, () => Math.floor(rand() * 9) + 1);
}

// ──────────────────────────────────────────────────────────────
// Benchmark
// ──────────────────────────────────────────────────────────────

function runBenchmark() {
    const array = generateLargeArray(100000);

    // Test 1: Randomized recursive
    let clone = [...array];
    let start = performance.now();
    OptimizedQuickSort.sort(clone);
    let elapsed = performance.now() - start;
    console.log(`Randomized Recursive: ${elapsed.toFixed(2)}ms`);

    // Test 2: Tail-optimized
    clone = [...array];
    start = performance.now();
    TailOptimizedQuickSort.sort(clone);
    elapsed = performance.now() - start;
    console.log(`Tail-Optimized: ${elapsed.toFixed(2)}ms`);

    // Test 3: Fully iterative
    clone = [...array];
    start = performance.now();
    IterativeQuickSort.sort(clone);
    elapsed = performance.now() - start;
    console.log(`Iterative: ${elapsed.toFixed(2)}ms`);

    // Test 4: 3-way (with duplicates)
    const arrayWithDupes = generateArrayWithDuplicates(100000);
    start = performance.now();
    ThreeWayQuickSort.sort(arrayWithDupes);
    elapsed = performance.now() - start;
    console.log(`3-Way (Many Dupes): ${elapsed.toFixed(2)}ms`);
}

// ──────────────────────────────────────────────────────────────
// Module Exports (for Node.js) / Run if executed directly
// ──────────────────────────────────────────────────────────────

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GenericQuickSort,
        QuickSortAlgorithm,
        OptimizedQuickSort,
        TailOptimizedQuickSort,
        ThreeWayQuickSort,
        IterativeQuickSort,
        generateLargeArray,
        generateArrayWithDuplicates,
        runBenchmark
    };
}

// Run benchmark if executed directly: node 1.js
if (typeof require !== 'undefined' && require.main === module) {
    console.log('=== QuickSort Benchmark ===\n');
    runBenchmark();
}
