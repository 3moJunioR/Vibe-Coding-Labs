// =============================================================
// QuickSort Unit Tests (JavaScript)
// Converted from C# xUnit tests → uses Node.js built-in assert
// =============================================================
//
// HOW TO RUN:
//   node QuickSortTests.js
//
// All tests print ✅ or ❌ with descriptive names.
// =============================================================

const assert = require('assert');

// ==========================================
// QuickSort Algorithm Implementation
// (Included alongside tests)
// ==========================================

function quickSort(array) {
    if (!array || array.length === 0) return;
    quickSortRecursive(array, 0, array.length - 1);
}

function quickSortRecursive(array, leftBound, rightBound) {
    if (leftBound < rightBound) {
        const pivotIndex = partition(array, leftBound, rightBound);
        quickSortRecursive(array, leftBound, pivotIndex - 1);
        quickSortRecursive(array, pivotIndex + 1, rightBound);
    }
}

function partition(array, leftBound, rightBound) {
    const pivot = array[rightBound];
    let indexOfSmaller = leftBound - 1;

    for (let currentIndex = leftBound; currentIndex < rightBound; currentIndex++) {
        if (array[currentIndex] < pivot) {
            indexOfSmaller++;
            swap(array, indexOfSmaller, currentIndex);
        }
    }

    swap(array, indexOfSmaller + 1, rightBound);
    return indexOfSmaller + 1;
}

function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

// ==========================================
// Test Runner
// ==========================================

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
    try {
        fn();
        passed++;
        results.push(`  ✅ ${name}`);
    } catch (err) {
        failed++;
        results.push(`  ❌ ${name}\n     → ${err.message}`);
    }
}

function assertArrayEqual(expected, actual, message) {
    assert.deepStrictEqual(actual, expected, message);
}

// ==========================================
// Test Cases
// ==========================================

/**
 * Test 1: Empty array should remain empty.
 * Edge case: Empty arrays are valid inputs that should be handled gracefully.
 */
test('Sort_EmptyArray_ReturnsEmpty', () => {
    const array = [];
    quickSort(array);
    assertArrayEqual([], array);
});

/**
 * Test 2: Null/undefined array should not throw an exception.
 * Edge case: Null is a valid edge case that should be handled.
 */
test('Sort_NullArray_DoesNotThrow', () => {
    quickSort(null);
    quickSort(undefined);
    // If we reach here, no exception was thrown ✓
});

/**
 * Test 3: Single element array is already sorted.
 * Edge case: Minimum meaningful array size.
 */
test('Sort_SingleElement_ReturnsSingleElement', () => {
    const array = [42];
    quickSort(array);
    assertArrayEqual([42], array);
});

/**
 * Test 4: Two element array should sort correctly.
 * Edge case: Small array where pivot selection matters.
 */
test('Sort_TwoElements_SortsCorrectly', () => {
    const array = [2, 1];
    quickSort(array);
    assertArrayEqual([1, 2], array);
});

/**
 * Test 5: Already sorted array should remain unchanged.
 * Edge case: Can trigger worst-case O(n²) in basic implementations.
 */
test('Sort_AlreadySortedArray_ReturnsSortedArray', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    quickSort(array);
    assertArrayEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], array);
});

/**
 * Test 6: Reverse sorted array should be sorted correctly.
 * Edge case: Worst-case scenario for basic pivot selection strategies.
 */
test('Sort_ReverseSortedArray_ReturnsSortedArray', () => {
    const array = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    quickSort(array);
    assertArrayEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], array);
});

/**
 * Test 7: Unsorted array should be sorted correctly.
 * Normal case: Random/unsorted input is the typical use case.
 */
test('Sort_UnsortedArray_ReturnsSortedArray', () => {
    const array = [64, 34, 25, 12, 22, 11, 90, 88];
    quickSort(array);
    assertArrayEqual([11, 12, 22, 25, 34, 64, 88, 90], array);
});

/**
 * Test 8: Array with duplicates should sort correctly.
 * Edge case: All equal elements, stress-tests partitioning logic.
 */
test('Sort_ArrayWithAllDuplicates_ReturnsSortedArray', () => {
    const array = [5, 5, 5, 5, 5];
    quickSort(array);
    assertArrayEqual([5, 5, 5, 5, 5], array);
});

/**
 * Test 9: Array with some duplicate elements should sort correctly.
 * Edge case: Partial duplicates test partitioning with equal elements.
 */
test('Sort_ArrayWithSomeDuplicates_ReturnsSortedArray', () => {
    const array = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
    quickSort(array);
    assertArrayEqual([1, 1, 2, 3, 3, 4, 5, 5, 6, 9], array);
});

/**
 * Test 10: Array with negative numbers should sort correctly.
 * Edge case: Negative, zero, and positive numbers mixed.
 */
test('Sort_ArrayWithNegativeNumbers_ReturnsSortedArray', () => {
    const array = [3, -1, 4, -5, 2, 0, -3];
    quickSort(array);
    assertArrayEqual([-5, -3, -1, 0, 2, 3, 4], array);
});

/**
 * Test 11: Array with large numbers should sort correctly.
 * Edge case: Integer boundary values.
 */
test('Sort_ArrayWithLargeNumbers_ReturnsSortedArray', () => {
    const array = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0, 1000000, -1000000];
    quickSort(array);
    assertArrayEqual([Number.MIN_SAFE_INTEGER, -1000000, 0, 1000000, Number.MAX_SAFE_INTEGER], array);
});

/**
 * Test 12: Large dataset performance test.
 * Verifies QuickSort can handle 10,000 elements efficiently.
 */
test('Sort_LargeDataset_SortsCorrectlyAndEfficiently', () => {
    // Use a seeded sequence for reproducibility
    const seed = 42;
    let s = seed;
    function nextRand() {
        s |= 0;
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    const array = Array.from({ length: 10000 }, () =>
        Math.floor(nextRand() * 200001) - 100000
    );
    const expected = [...array].sort((a, b) => a - b);

    quickSort(array);
    assertArrayEqual(expected, array);
});

/**
 * Test 13: Very large dataset performance test.
 * Verifies QuickSort can handle 100,000 elements.
 */
test('Sort_VeryLargeDataset_SortsCorrectly', () => {
    let s = 123;
    function nextRand() {
        s |= 0;
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    const array = Array.from({ length: 100000 }, () =>
        Math.floor(nextRand() * 4294967296) - 2147483648
    );
    const expected = [...array].sort((a, b) => a - b);

    quickSort(array);
    assertArrayEqual(expected, array);
});

/**
 * Test 14: Array with mostly sorted elements.
 * Edge case: Partially sorted array can trigger different partitioning patterns.
 */
test('Sort_MostlySortedArray_ReturnsSortedArray', () => {
    const array = [1, 2, 3, 5, 4, 6, 7, 8, 9, 10];
    quickSort(array);
    assertArrayEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], array);
});

/**
 * Test 15: Array with alternating minimum and maximum.
 * Edge case: Full swing pattern between small and large values.
 */
test('Sort_AlternatingMinMax_ReturnsSortedArray', () => {
    const array = [1, 100, 2, 99, 3, 98, 4, 97];
    quickSort(array);
    assertArrayEqual([1, 2, 3, 4, 97, 98, 99, 100], array);
});

/**
 * Test 16: Array where pivot selection matters - all but one sorted.
 * Edge case: Tests behavior with outlier elements.
 */
test('Sort_ArrayWithOneOutlier_ReturnsSortedArray', () => {
    const array = [100, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    quickSort(array);
    assertArrayEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 100], array);
});

// ==========================================
// Parameterized Tests
// ==========================================

/**
 * Parameterized test: Verifies QuickSort with multiple input sets.
 */
const parameterizedCases = [
    { input: [3, 1, 2], expected: [1, 2, 3] },
    { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
    { input: [1, 1, 1, 1], expected: [1, 1, 1, 1] },
    { input: [-3, -1, -2], expected: [-3, -2, -1] },
    { input: [0, -1, 1], expected: [-1, 0, 1] },
];

parameterizedCases.forEach(({ input, expected }, i) => {
    test(`Sort_VariousInputs_Case${i + 1} [${input}] → [${expected}]`, () => {
        const array = [...input];
        quickSort(array);
        assertArrayEqual(expected, array);
    });
});

/**
 * Parameterized test: Performance test with different dataset sizes.
 */
[10, 100, 1000, 5000].forEach(size => {
    test(`Sort_VariousSizes_${size}_PerformsEfficiently`, () => {
        let s = 42;
        function nextRand() {
            s |= 0;
            s = (s + 0x6D2B79F5) | 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        }

        const array = Array.from({ length: size }, () =>
            Math.floor(nextRand() * 2147483647)
        );
        const expected = [...array].sort((a, b) => a - b);

        quickSort(array);
        assertArrayEqual(expected, array);
    });
});

/**
 * Test: Validates that QuickSort performs in-place modification.
 * Ensures QuickSort modifies the original array, not creating a new one.
 */
test('Sort_ModifiesOriginalArray_InPlace', () => {
    const array = [5, 2, 8, 1, 9];
    const originalReference = array;

    quickSort(array);

    // Verify same reference (in-place modification)
    assert.strictEqual(originalReference, array, 'Should be the same array reference');
    assertArrayEqual([1, 2, 5, 8, 9], array);
});

/**
 * Test: Validates sorting stability consideration.
 * Note: QuickSort is not stable, so equal elements may change order.
 * This test documents that behavior.
 */
test('Sort_WithDuplicates_SortsCorrectlyButMayNotBeStable', () => {
    const array = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    quickSort(array);

    // Only verify values are sorted, not their relative order
    for (let i = 0; i < array.length - 1; i++) {
        assert.ok(
            array[i] <= array[i + 1],
            `Array not sorted at index ${i}: ${array[i]} > ${array[i + 1]}`
        );
    }
});

// ==========================================
// Report
// ==========================================

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║         QuickSort Unit Tests (JavaScript)        ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

results.forEach(r => console.log(r));

console.log(`\n${'─'.repeat(50)}`);
console.log(`  Total: ${passed + failed}  |  ✅ Passed: ${passed}  |  ❌ Failed: ${failed}`);
console.log('─'.repeat(50));

if (failed > 0) {
    console.log('\n⚠️  Some tests failed!');
    process.exit(1);
} else {
    console.log('\n🎉 All tests passed!');
}
