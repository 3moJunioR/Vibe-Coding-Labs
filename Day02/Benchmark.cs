// =============================================================
// TASK 8: Performance Benchmark — QuickSort vs Array.Sort()
// =============================================================
//
// This benchmark compares:
//   1. Custom Recursive QuickSort
//   2. Custom Randomized QuickSort
//   3. Custom Tail-Optimized QuickSort
//   4. Built-in Array.Sort() (uses Introsort internally)
//
// Uses System.Diagnostics.Stopwatch for accurate timing.
// Tests across different array sizes and data patterns.
//
// HOW TO RUN:
//   dotnet run   (in a .NET Console project)
// =============================================================

using System;
using System.Diagnostics;
using System.Linq;

/// <summary>
/// Performance benchmark runner for QuickSort variants vs Array.Sort().
/// </summary>
public class QuickSortBenchmark
{
    private static readonly Random _random = new Random(42); // Fixed seed for reproducibility

    public static void Main(string[] args)
    {
        Console.WriteLine("╔══════════════════════════════════════════════════════════════╗");
        Console.WriteLine("║          QuickSort Performance Benchmark                     ║");
        Console.WriteLine("╚══════════════════════════════════════════════════════════════╝");
        Console.WriteLine();

        int[] sizes = { 1_000, 10_000, 100_000, 500_000, 1_000_000 };

        foreach (int size in sizes)
        {
            RunBenchmarkForSize(size);
        }

        Console.WriteLine("\n📊 Additional Pattern Benchmarks (size = 100,000)");
        Console.WriteLine(new string('─', 65));
        RunPatternBenchmarks(100_000);

        Console.WriteLine("\n✅ Benchmark complete!");
        Console.ReadLine();
    }

    /// <summary>
    /// Runs a full benchmark round for a given array size.
    /// </summary>
    private static void RunBenchmarkForSize(int size)
    {
        Console.WriteLine($"\n🔢 Array Size: {size:N0}");
        Console.WriteLine(new string('─', 65));
        Console.WriteLine($"{"Algorithm",-35} {"Time (ms)",10} {"Time (μs)",12}");
        Console.WriteLine(new string('─', 65));

        // Generate a random base array
        int[] baseArray = GenerateRandomArray(size);

        // Benchmark each algorithm
        BenchmarkAlgorithm("Recursive QuickSort",       baseArray, arr => RecursiveQuickSort(arr, 0, arr.Length - 1));
        BenchmarkAlgorithm("Randomized QuickSort",      baseArray, arr => RandomizedQuickSort(arr, 0, arr.Length - 1));
        BenchmarkAlgorithm("Tail-Optimized QuickSort",  baseArray, arr => TailOptimizedQuickSortHelper(arr, 0, arr.Length - 1));
        BenchmarkAlgorithm("Built-in Array.Sort()",     baseArray, arr => Array.Sort(arr));

        Console.WriteLine(new string('─', 65));
    }

    /// <summary>
    /// Runs benchmarks against specific data patterns.
    /// </summary>
    private static void RunPatternBenchmarks(int size)
    {
        Console.WriteLine($"\n{"Pattern",-25} {"Algorithm",-30} {"Time (ms)",10}");
        Console.WriteLine(new string('─', 70));

        // Already Sorted
        int[] sorted = Enumerable.Range(1, size).ToArray();
        BenchmarkPattern("Already Sorted",    sorted, arr => RecursiveQuickSort(arr, 0, arr.Length - 1));
        BenchmarkPattern("Already Sorted",    sorted, arr => RandomizedQuickSort(arr, 0, arr.Length - 1));
        BenchmarkPattern("Already Sorted",    sorted, arr => Array.Sort(arr));

        Console.WriteLine();

        // Reverse Sorted
        int[] reversed = Enumerable.Range(1, size).Reverse().ToArray();
        BenchmarkPattern("Reverse Sorted",    reversed, arr => RecursiveQuickSort(arr, 0, arr.Length - 1));
        BenchmarkPattern("Reverse Sorted",    reversed, arr => RandomizedQuickSort(arr, 0, arr.Length - 1));
        BenchmarkPattern("Reverse Sorted",    reversed, arr => Array.Sort(arr));

        Console.WriteLine();

        // All Same
        int[] allSame = Enumerable.Repeat(42, size).ToArray();
        BenchmarkPattern("All Same Values",   allSame, arr => RecursiveQuickSort(arr, 0, arr.Length - 1));
        BenchmarkPattern("All Same Values",   allSame, arr => RandomizedQuickSort(arr, 0, arr.Length - 1));
        BenchmarkPattern("All Same Values",   allSame, arr => Array.Sort(arr));
    }

    // ──────────────────────────────────────────────────────────
    // Helper Methods
    // ──────────────────────────────────────────────────────────

    private static void BenchmarkAlgorithm(string name, int[] original, Action<int[]> sortFn)
    {
        // Clone the array so each test starts with the same unsorted data
        int[] testArray = (int[])original.Clone();

        // Warm up (avoid JIT compilation affecting first result)
        int[] warmup = (int[])original.Take(100).ToArray().Clone();
        sortFn(warmup);

        // Actual timing
        Stopwatch sw = Stopwatch.StartNew();
        sortFn(testArray);
        sw.Stop();

        double ms = sw.Elapsed.TotalMilliseconds;
        double us = sw.Elapsed.TotalMicroseconds;

        Console.WriteLine($"  {name,-33} {ms,10:F3} {us,12:F0}");
    }

    private static void BenchmarkPattern(string pattern, int[] original, Action<int[]> sortFn)
    {
        // Detect algorithm name from delegate
        string algName = sortFn.Method.Name.Contains("Array") ? "Array.Sort()"
                       : sortFn.Method.Name.Contains("Random") ? "Randomized QuickSort"
                       : "Recursive QuickSort";

        int[] testArray = (int[])original.Clone();

        Stopwatch sw = Stopwatch.StartNew();
        sortFn(testArray);
        sw.Stop();

        double ms = sw.Elapsed.TotalMilliseconds;
        Console.WriteLine($"  {pattern,-25} {algName,-30} {ms,10:F3}");
    }

    private static int[] GenerateRandomArray(int size)
    {
        return Enumerable.Range(0, size)
            .Select(_ => _random.Next(int.MinValue, int.MaxValue))
            .ToArray();
    }

    // ──────────────────────────────────────────────────────────
    // QuickSort Implementations (Self-Contained for Benchmark)
    // ──────────────────────────────────────────────────────────

    /// <summary>Standard recursive QuickSort (last element pivot).</summary>
    private static void RecursiveQuickSort(int[] array, int left, int right)
    {
        if (left < right)
        {
            int pivot = Partition(array, left, right);
            RecursiveQuickSort(array, left, pivot - 1);
            RecursiveQuickSort(array, pivot + 1, right);
        }
    }

    /// <summary>Randomized pivot QuickSort (avoids worst case on sorted input).</summary>
    private static void RandomizedQuickSort(int[] array, int left, int right)
    {
        if (left < right)
        {
            int pivotIdx = left + _random.Next(right - left + 1);
            Swap(array, pivotIdx, right);

            int pivot = Partition(array, left, right);
            RandomizedQuickSort(array, left, pivot - 1);
            RandomizedQuickSort(array, pivot + 1, right);
        }
    }

    /// <summary>Tail-optimized QuickSort. Minimizes stack depth to O(log n).</summary>
    private static void TailOptimizedQuickSortHelper(int[] array, int left, int right)
    {
        while (left < right)
        {
            int pivot = Partition(array, left, right);

            // Recurse on smaller partition, iterate on larger
            if (pivot - left < right - pivot)
            {
                TailOptimizedQuickSortHelper(array, left, pivot - 1);
                left = pivot + 1;
            }
            else
            {
                TailOptimizedQuickSortHelper(array, pivot + 1, right);
                right = pivot - 1;
            }
        }
    }

    private static int Partition(int[] array, int left, int right)
    {
        int pivot = array[right];
        int i = left - 1;

        for (int j = left; j < right; j++)
        {
            if (array[j] < pivot)
            {
                i++;
                Swap(array, i, j);
            }
        }

        Swap(array, i + 1, right);
        return i + 1;
    }

    private static void Swap(int[] array, int i, int j)
    {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/*
═══════════════════════════════════════════════════════════
EXPECTED BENCHMARK RESULTS (approximate, on modern hardware)
═══════════════════════════════════════════════════════════

Array Size: 100,000 elements
─────────────────────────────────────────────────────────────────
Algorithm                           Time (ms)      Time (μs)
─────────────────────────────────────────────────────────────────
  Recursive QuickSort                  12-18 ms      12000-18000
  Randomized QuickSort                 14-20 ms      14000-20000
  Tail-Optimized QuickSort             12-17 ms      12000-17000
  Built-in Array.Sort()                 8-12 ms       8000-12000
─────────────────────────────────────────────────────────────────

NOTES:
- Array.Sort() uses Introsort (hybrid of QuickSort + HeapSort + InsertionSort)
  which is why it tends to slightly outperform pure QuickSort.
- Randomized QuickSort is slightly slower on random data (RNG overhead),
  BUT is much faster than Recursive QuickSort on SORTED data.
- Tail-Optimized QuickSort has the same speed but uses less stack memory.
- All custom implementations are O(n log n) average, vs Array.Sort's O(n log n).

WHY Array.Sort() IS FASTER:
  1. Native (compiled) code, heavily optimized by the .NET runtime
  2. Introsort switches to HeapSort when recursion depth exceeds 2*log(n)
  3. Uses InsertionSort for small subarrays (< 16 elements)
  4. Fully inlined hot paths — no method call overhead in inner loop
*/
