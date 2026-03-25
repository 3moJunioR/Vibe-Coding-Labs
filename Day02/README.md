# 🚀 QuickSort Project in C#

A comprehensive implementation, analysis, and benchmarking of the QuickSort algorithm in C#.

---

## 📋 Project Description

This project provides a **complete educational and practical guide** to the QuickSort algorithm in C#.
It covers everything from a clean, readable implementation to optimized variants, unit testing,
performance benchmarking, debugging practice, and a live interactive web visualizer.

---

## 🤖 How GitHub Copilot Helped

GitHub Copilot was used throughout this project to:

| Task | How Copilot Helped |
|------|--------------------|
| **Code generation** | Generated the initial QuickSort skeleton with correct method signatures |
| **Documentation** | Auto-completed XML doc comments and inline explanations |
| **Unit tests** | Suggested edge cases like null arrays, duplicates, and large datasets |
| **Optimizations** | Proposed the randomized pivot and tail-recursion optimization patterns |
| **Debugging** | Helped identify the off-by-one error in the loop condition |
| **Benchmark** | Generated the Stopwatch measurement code and result formatting |
| **README** | Drafted the project structure and documentation layout |

Copilot served as a **pair programmer**, accelerating repetitive tasks while I focused on understanding the algorithm deeply.

---

## 🧠 Algorithm Explanation

### What is QuickSort?

QuickSort is a **divide-and-conquer** sorting algorithm. It works by:

1. **Select a pivot** — Choose one element from the array as the "pivot"
2. **Partition** — Rearrange the array so all elements smaller than the pivot go left, larger go right
3. **Recurse** — Apply the same process recursively to the left and right partitions
4. **Base case** — Stop when a partition has 0 or 1 elements (already sorted)

```
[64, 34, 25, 12, 22, 11, 90]
                            ↑ pivot = 90

After partition:
[64, 34, 25, 12, 22, 11] | 90 | []
         ↑ recurse              ↑ recurse (empty, done)

Next level: [64, 34, 25, 12, 22] | 11 | (already smallest)
...and so on until fully sorted
```

### Partitioning (Lomuto Scheme)

The key step is the `Partition()` function:

```csharp
// Pivot = last element
// Move all smaller elements to the left
for (int i = left; i < right; i++)   // ← must be strict <
{
    if (array[i] < pivot)
    {
        Swap(array, ++indexOfSmaller, i);
    }
}
// Place pivot in its final sorted position
Swap(array, indexOfSmaller + 1, right);
```

---

## 📁 Project Structure

```
QuickSort/
├── 1.cs                  # All QuickSort implementations
│   ├── QuickSortAlgorithm      (Task 1 & 2: Clean + commented)
│   ├── OptimizedQuickSort      (Task 3: Randomized pivot)
│   ├── TailOptimizedQuickSort  (Task 3: Tail recursion)
│   ├── ThreeWayQuickSort       (Task 3: Duplicate-efficient)
│   ├── IterativeQuickSort      (Task 3: Non-recursive)
│   └── GenericQuickSort        (Bonus: Generic type support)
│
├── BuggyQuickSort.cs     # Task 7: Bug demo + debug guide + fixed version
├── Benchmark.cs          # Task 8: Performance benchmark with Stopwatch
├── QuickSortTests.cs     # Task 5: xUnit unit tests (19 test cases)
├── quicksort.html        # Task 6: Interactive web visualizer
└── ComparisonTable.md    # Task 4: Algorithm comparison table
```

---

## ⚡ Performance Comparison

Results on a modern machine (~2.5 GHz, 100,000 elements):

| Algorithm | Random Data | Sorted Input | All Duplicates | Space |
|-----------|:-----------:|:------------:|:--------------:|:-----:|
| Recursive QuickSort | ~15ms | ❌ Very slow (O(n²)) | slow | O(log n) |
| Randomized QuickSort | ~17ms | ✅ ~15ms | moderate | O(log n) |
| Tail-Optimized QuickSort | ~14ms | ❌ slow | moderate | O(log n) |
| 3-Way QuickSort | ~13ms | ~15ms | ✅ ~3ms (O(n)) | O(log n) |
| **Array.Sort() (Introsort)** | **~10ms** | **✅ ~5ms** | **✅ ~5ms** | O(log n) |

> **Winner:** `Array.Sort()` — uses a hybrid Introsort (QuickSort + HeapSort + InsertionSort)

---

## 🐛 Bug Example & Fix

**Bug:** Loop uses `<=` instead of `<` in the partition scan:

```csharp
// ❌ Buggy - processes the pivot element inside the loop
for (int i = left; i <= right; i++)

// ✅ Fixed - excludes the pivot from the scan
for (int i = left; i < right; i++)
```

**Effect:** With `<=`, the pivot element at index `right` is visited during the scan,
causing it to be swapped away before it gets placed in its final position,
corrupting the partition and potentially causing infinite recursion on duplicate arrays.

See [BuggyQuickSort.cs](./BuggyQuickSort.cs) for the full debugging walkthrough.

---

## 🧪 Running Unit Tests

```bash
# Install xUnit (in a test project)
dotnet new xunit -n QuickSortTests
cp QuickSortTests.cs QuickSortTests/

# Run tests
dotnet test
```

**Test Coverage:**
- ✅ Empty array
- ✅ Null array
- ✅ Single element
- ✅ Two elements
- ✅ Already sorted
- ✅ Reverse sorted
- ✅ Random unsorted
- ✅ All duplicates
- ✅ Some duplicates
- ✅ Negative numbers
- ✅ Integer boundaries (MaxValue, MinValue)
- ✅ 10,000 elements
- ✅ 100,000 elements
- ✅ Parameterized theory tests
- ✅ In-place modification verification

---

## 🌐 Web Visualizer

Open [quicksort.html](./quicksort.html) in any browser.

- Enter comma-separated numbers: `3,5,2,6,1`
- Click **Sort with QuickSort**
- See the original and sorted arrays, array size, and execution time

---

## 📚 Key Learnings

1. **Pivot choice matters** — Always using the last element causes O(n²) on sorted arrays. Randomized pivots fix this.

2. **The loop condition is critical** — A single `<=` vs `<` off-by-one error completely breaks the algorithm.

3. **Tail recursion prevents stack overflow** — Always recurse on the smaller partition first; iterate on the larger one.

4. **3-Way partitioning is crucial for duplicates** — Standard QuickSort degrades to O(n²) on arrays of all-same values.

5. **Array.Sort() is almost always the right choice** — It uses Introsort, a battle-tested hybrid that avoids every weakness pure QuickSort has.

6. **Unit testing reveals edge cases** — Without tests for null, single-element, and all-duplicate arrays, subtle bugs go unnoticed.

---

## 📖 References

- [Wikipedia: Quicksort](https://en.wikipedia.org/wiki/Quicksort)
- [Microsoft Docs: Array.Sort](https://learn.microsoft.com/en-us/dotnet/api/system.array.sort)
- [Introsort Algorithm](https://en.wikipedia.org/wiki/Introsort)
- [Lomuto Partition Scheme](https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme)

---

*Generated as part of an ITI AI Lab exercise exploring GitHub Copilot-assisted development.*
