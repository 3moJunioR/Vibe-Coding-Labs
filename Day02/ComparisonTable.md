# 📊 Sorting Algorithm Comparison: QuickSort vs MergeSort vs HeapSort vs Array.Sort()

## Time & Space Complexity Table

| Algorithm       | Best Case    | Average Case | Worst Case   | Space Complexity | Stable? |
|-----------------|:------------:|:------------:|:------------:|:----------------:|:-------:|
| **QuickSort**   | O(n log n)   | O(n log n)   | O(n²)        | O(log n)         | ❌ No   |
| **MergeSort**   | O(n log n)   | O(n log n)   | O(n log n)   | O(n)             | ✅ Yes  |
| **HeapSort**    | O(n log n)   | O(n log n)   | O(n log n)   | O(1)             | ❌ No   |
| **Array.Sort()** (Introsort) | O(n log n) | O(n log n) | O(n log n) | O(log n) | ❌ No  |

---

## Detailed Breakdown

### 🔵 QuickSort

```
Best Case:    O(n log n) — pivot always splits the array in half
Average Case: O(n log n) — expected with random pivot
Worst Case:   O(n²)      — when pivot is always the smallest/largest (e.g., already sorted)
Space:        O(log n)   — recursive call stack depth
```

**Pros:**
- Fastest in practice for random data (best cache performance)
- In-place sorting (no extra array needed)
- Very low constant factors

**Cons:**
- Worst case O(n²) on sorted or nearly-sorted data
- Not stable (equal elements may change relative order)
- Can cause stack overflow on very large arrays without tail optimization

**When to use:** Large datasets with random data, when memory is limited, when stability is not required.

---

### 🟢 MergeSort

```
Best Case:    O(n log n)
Average Case: O(n log n)
Worst Case:   O(n log n) — always consistent!
Space:        O(n)       — requires a full auxiliary array
```

**Pros:**
- Guaranteed O(n log n) — stable performance on all inputs
- Stable sort (preserves relative order of equal elements)
- Ideal for linked lists (no random access needed)
- Predictable memory usage

**Cons:**
- Requires O(n) extra memory
- Slower than QuickSort in practice (more memory allocations, cache misses)

**When to use:** When stability is required, when working with linked lists, when worst-case guarantee matters (live systems, databases).

---

### 🟡 HeapSort

```
Best Case:    O(n log n)
Average Case: O(n log n)
Worst Case:   O(n log n) — guaranteed!
Space:        O(1)       — in-place, no extra memory
```

**Pros:**
- Guaranteed O(n log n) — no worst case degradation
- In-place (O(1) extra space)
- Excellent space efficiency

**Cons:**
- Not stable
- Poor cache performance (heap accesses jump around in memory)
- Slower in practice than QuickSort despite same complexity

**When to use:** When memory is very constrained AND you need worst-case guarantees. Embedded systems, real-time systems.

---

### 🔴 Array.Sort() — C# Built-in (Introsort)

```
Best Case:    O(n log n)
Average Case: O(n log n)
Worst Case:   O(n log n) — hybrid algorithm prevents O(n²)
Space:        O(log n)
```

**Introsort = QuickSort + HeapSort + InsertionSort:**
- Starts as QuickSort for speed
- Switches to **HeapSort** if recursion depth exceeds 2×log(n) to avoid worst case
- Switches to **InsertionSort** for partitions < 16 elements (faster for tiny arrays)

**Pros:**
- Best of all worlds: fast average + worst case guarantee
- Highly optimized native C# runtime code
- Practical winner for most real applications

**Cons:**
- Not stable (use `Array.Sort()` with `IComparer` or LINQ `OrderBy` for stable sort)
- Black box — cannot customize the algorithm

**When to use:** **Default choice** in production C# code. Always prefer `Array.Sort()` unless you have a specific reason to implement your own.

---

## 📈 Performance Comparison (Practical)

| Scenario                  | Fastest         | Notes                                      |
|---------------------------|:---------------:|--------------------------------------------|
| Random large data         | Array.Sort()    | JIT-optimized Introsort wins               |
| Already sorted input      | Array.Sort() / MergeSort | QuickSort degrades to O(n²)      |
| Many duplicates           | 3-Way QuickSort | Groups equal elements, skips re-sorting    |
| Limited memory            | HeapSort        | O(1) extra space                           |
| Need stable sort          | MergeSort       | Only guarantee of stable sort here         |
| Linked list               | MergeSort       | No random access required                  |
| Small arrays (< 20 items) | InsertionSort   | Less overhead than divide-and-conquer      |

---

## 🏆 Summary Recommendation

```
General purpose sorting in C#:   → Array.Sort()
Need stability:                   → Array.Sort(arr).Stable() or LINQ OrderBy()  
Memory-critical, no stability:    → HeapSort
Educational / interviews:         → QuickSort (most asked about)
Worst-case guarantee + stability: → MergeSort
```
