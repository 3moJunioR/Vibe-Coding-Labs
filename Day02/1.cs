/// <summary>
/// Generic QuickSort implementation that works with any comparable type.
/// </summary>
public class GenericQuickSort
{
    /// <summary>
    /// Sorts a generic array in ascending order using the QuickSort algorithm.
    /// </summary>
    /// <typeparam name="T">The type of elements in the array (must be comparable).</typeparam>
    /// <param name="array">The array to be sorted.</param>
    public static void Sort<T>(T[] array) where T : IComparable<T>
    {
        if (array == null || array.Length == 0)
            return;

        QuickSortRecursive(array, 0, array.Length - 1);
    }

    private static void QuickSortRecursive<T>(T[] array, int leftBound, int rightBound) where T : IComparable<T>
    {
        if (leftBound < rightBound)
        {
            int pivotIndex = Partition(array, leftBound, rightBound);
            QuickSortRecursive(array, leftBound, pivotIndex - 1);
            QuickSortRecursive(array, pivotIndex + 1, rightBound);
        }
    }

    private static int Partition<T>(T[] array, int leftBound, int rightBound) where T : IComparable<T>
    {
        T pivot = array[rightBound];
        int indexOfSmaller = leftBound - 1;

        for (int currentIndex = leftBound; currentIndex < rightBound; currentIndex++)
        {
            if (array[currentIndex].CompareTo(pivot) < 0)
            {
                indexOfSmaller++;
                Swap(array, indexOfSmaller, currentIndex);
            }
        }

        Swap(array, indexOfSmaller + 1, rightBound);
        return indexOfSmaller + 1;
    }

    private static void Swap<T>(T[] array, int firstIndex, int secondIndex)
    {
        T temp = array[firstIndex];
        array[firstIndex] = array[secondIndex];
        array[secondIndex] = temp;
    }
}

/// <summary>
/// QuickSort Algorithm - Sorts an array by partitioning and recursively sorting partitions.
/// </summary>
public class QuickSortAlgorithm
{
    /// <summary>
    /// PUBLIC ENTRY POINT - This is what users call to sort their array.
    /// </summary>
    public static void Sort(int[] array)
    {
        // Safety check: Don't process null or empty arrays
        if (array == null || array.Length == 0)
            return;

        // Call the recursive helper function with the entire array
        // Parameters: (array, startIndex, endIndex)
        QuickSortRecursive(array, 0, array.Length - 1);
    }

    /// <summary>
    /// RECURSIVE HELPER - This method calls itself on smaller partitions.
    /// </summary>
    /// <remarks>
    /// How recursion works here:
    /// 1. Partition the array around a pivot
    /// 2. Recursively sort the left partition (smaller elements)
    /// 3. Recursively sort the right partition (larger elements)
    /// 4. Stop when left >= right (partition size is 0 or 1)
    /// </remarks>
    private static void QuickSortRecursive(int[] array, int leftBound, int rightBound)
    {
        // BASE CASE: If the partition has only 1 or fewer elements, it's already sorted
        // Stop the recursion here to avoid infinite loops
        if (leftBound < rightBound)
        {
            // STEP 1: Partition the array around a pivot
            // This returns the final position of the pivot element
            // After this, pivot is in its correct sorted position
            int pivotIndex = Partition(array, leftBound, rightBound);

            // STEP 2: Recursively sort the LEFT partition (smaller than pivot)
            // We sort from leftBound to (pivotIndex - 1)
            // We exclude the pivot itself because it's already in the right spot
            QuickSortRecursive(array, leftBound, pivotIndex - 1);

            // STEP 3: Recursively sort the RIGHT partition (larger than pivot)
            // We sort from (pivotIndex + 1) to rightBound
            // Again, we exclude the pivot
            QuickSortRecursive(array, pivotIndex + 1, rightBound);
        }
        // When the function returns, this partition is fully sorted
    }

    /// <summary>
    /// PARTITIONING FUNCTION - Rearranges elements around a pivot.
    /// This is the heart of QuickSort - it puts the pivot in its final position.
    /// </summary>
    /// <remarks>
    /// Strategy: Use the last element as pivot, then move smaller elements left.
    /// Example: [64, 34, 25, 12, 22, 11, 90, 88]
    /// Pivot = 88 (last element)
    /// Result: [64, 34, 25, 12, 22, 11, 88, 90]
    ///          smaller than 88 | 88 | larger than 88
    /// </remarks>
    private static int Partition(int[] array, int leftBound, int rightBound)
    {
        // SELECT PIVOT: Use the rightmost element as our reference point
        // (We could also pick random, middle, or first element)
        int pivot = array[rightBound];

        // INITIALIZE: This tracks the boundary between smaller and larger elements
        // indexOfSmaller points to the last element that is smaller than pivot
        // Everything to its left is smaller than pivot
        int indexOfSmaller = leftBound - 1;

        // SCAN: Go through each element from left to the second-to-last
        // (We skip the rightmost element because it's our pivot)
        for (int currentIndex = leftBound; currentIndex < rightBound; currentIndex++)
        {
            // CHECK: Is the current element smaller than the pivot?
            if (array[currentIndex] < pivot)
            {
                // YES - This element belongs on the left side
                // Move the boundary one position right
                indexOfSmaller++;

                // Swap the current element with the element at the boundary
                // This places the small element in the "left" section
                Swap(array, indexOfSmaller, currentIndex);
                // Example: if array was [12, 34, 25, 88] and we found 25 < 88
                //          we swap 34 and 25 to get [12, 25, 34, 88]
            }
            // If current element >= pivot, we don't swap
            // It naturally ends up in the right section
        }

        // FINALIZE: Place the pivot in its correct position
        // The pivot goes just after all the smaller elements
        Swap(array, indexOfSmaller + 1, rightBound);

        // RETURN: The final position of the pivot
        // This tells the caller where the pivot ended up
        // The pivot is now in its permanent sorted position!
        return indexOfSmaller + 1;
    }

    /// <summary>
    /// UTILITY HELPER - Swaps two elements in the array.
    /// This is used by Partition to rearrange elements.
    /// </summary>
    private static void Swap(int[] array, int firstIndex, int secondIndex)
    {
        // Store the first value in temporary storage
        int temp = array[firstIndex];

        // Copy the second value to the first position
        array[firstIndex] = array[secondIndex];

        // Copy the temporary value to the second position
        array[secondIndex] = temp;

        // Example: Swap(arr, 0, 2) on [64, 34, 25]
        // Step 1: temp = 64
        // Step 2: arr[0] = 25  → [25, 34, 25]
        // Step 3: arr[2] = 64  → [25, 34, 64]
    }
}

/// <summary>
/// Optimized QuickSort with randomized pivot selection.
/// Randomization prevents worst-case O(n²) on sorted arrays.
/// </summary>
public class OptimizedQuickSort
{
    private static Random _random = new Random();

    /// <summary>
    /// Entry point for sorting with randomized pivot selection.
    /// </summary>
    public static void Sort(int[] array)
    {
        if (array == null || array.Length == 0)
            return;

        QuickSortRecursive(array, 0, array.Length - 1);
    }

    /// <summary>
    /// Recursive QuickSort with randomized pivot selection.
    /// 
    /// WHY RANDOMIZATION HELPS:
    /// - Worst case occurs when pivot is always smallest/largest element
    /// - This happens naturally with sorted arrays
    /// - Random pivot eliminates this predictable bad case
    /// - Expected time: O(n log n) even on sorted data
    /// </summary>
    private static void QuickSortRecursive(int[] array, int left, int right)
    {
        if (left < right)
        {
            // RANDOMIZED PIVOT: Select a random element in the partition
            // instead of always using the last element
            int randomPivotIndex = left + _random.Next(right - left + 1);
            
            // Move random pivot to the end before partitioning
            Swap(array, randomPivotIndex, right);

            // Partition around the pivot
            int pivotFinalPosition = Partition(array, left, right);

            // Recursively sort left partition
            QuickSortRecursive(array, left, pivotFinalPosition - 1);

            // Recursively sort right partition (tail recursion optimization)
            QuickSortRecursive(array, pivotFinalPosition + 1, right);
        }
    }

    private static int Partition(int[] array, int left, int right)
    {
        int pivot = array[right];
        int indexOfSmaller = left - 1;

        for (int i = left; i < right; i++)
        {
            if (array[i] < pivot)
            {
                indexOfSmaller++;
                Swap(array, indexOfSmaller, i);
            }
        }

        Swap(array, indexOfSmaller + 1, right);
        return indexOfSmaller + 1;
    }

    private static void Swap(int[] array, int i, int j)
    {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/// <summary>
/// QuickSort with tail recursion optimization.
/// 
/// TAIL RECURSION OPTIMIZATION EXPLAINED:
/// Normal recursion: Sort(left), then Sort(right) - uses stack for both
/// Tail optimized: Sort smaller partition recursively, iterate on larger
/// 
/// This reduces maximum stack depth to O(log n) instead of O(n)
/// Prevents stack overflow on large nearly-sorted datasets
/// </summary>
public class TailOptimizedQuickSort
{
    /// <summary>
    /// Sorts array using tail recursion optimization.
    /// Dramatically reduces stack memory for large arrays.
    /// </summary>
    public static void Sort(int[] array)
    {
        if (array == null || array.Length == 0)
            return;

        QuickSortTailOptimized(array, 0, array.Length - 1);
    }

    /// <summary>
    /// Tail-optimized recursive QuickSort.
    /// 
    /// Strategy:
    /// 1. Partition the array
    /// 2. Recursively sort the SMALLER partition
    /// 3. Use iteration (while loop) for the LARGER partition
    /// 
    /// Why: The smaller partition's recursion depth is limited.
    /// The larger partition is handled iteratively, avoiding stack growth.
    /// </summary>
    private static void QuickSortTailOptimized(int[] array, int left, int right)
    {
        // Use a loop instead of recursion for the tail part
        while (left < right)
        {
            // Partition
            int pivotIndex = Partition(array, left, right);

            // Check which partition is smaller
            if (pivotIndex - left < right - pivotIndex)
            {
                // LEFT partition is smaller
                // Recursively sort the left (smaller) partition
                QuickSortTailOptimized(array, left, pivotIndex - 1);

                // Use iteration for the right (larger) partition
                // Instead of: QuickSortTailOptimized(array, pivotIndex + 1, right);
                left = pivotIndex + 1;  // Move left pointer, loop continues
            }
            else
            {
                // RIGHT partition is smaller
                // Recursively sort the right (smaller) partition
                QuickSortTailOptimized(array, pivotIndex + 1, right);

                // Use iteration for the left (larger) partition
                right = pivotIndex - 1;  // Move right pointer, loop continues
            }
        }
    }

    private static int Partition(int[] array, int left, int right)
    {
        int pivot = array[right];
        int indexOfSmaller = left - 1;

        for (int i = left; i < right; i++)
        {
            if (array[i] < pivot)
            {
                indexOfSmaller++;
                Swap(array, indexOfSmaller, i);
            }
        }

        Swap(array, indexOfSmaller + 1, right);
        return indexOfSmaller + 1;
    }

    private static void Swap(int[] array, int i, int j)
    {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/// <summary>
/// QuickSort with 3-way partitioning (Bentley-McIlroy QuickSort).
/// 
/// OPTIMIZED FOR ARRAYS WITH MANY DUPLICATES:
/// - Regular 2-way: O(n²) when array is all same values
/// - 3-way: O(n) when array is all same values
/// 
/// Strategy:
/// Partitions into THREE regions:
/// 1. Elements < pivot (left)
/// 2. Elements = pivot (middle) - already in final position!
/// 3. Elements > pivot (right)
/// </summary>
public class ThreeWayQuickSort
{
    private static Random _random = new Random();

    public static void Sort(int[] array)
    {
        if (array == null || array.Length == 0)
            return;

        QuickSort3Way(array, 0, array.Length - 1);
    }

    /// <summary>
    /// 3-way partitioning QuickSort.
    /// Much more efficient when there are many duplicate values.
    /// </summary>
    private static void QuickSort3Way(int[] array, int left, int right)
    {
        if (left < right)
        {
            // Random pivot to avoid worst case
            int randomIndex = left + _random.Next(right - left + 1);
            Swap(array, randomIndex, right);

            // Perform 3-way partition
            // Returns two values: where equals region starts and ends
            (int eqLeft, int eqRight) = Partition3Way(array, left, right);

            // Recursively sort the less-than region
            QuickSort3Way(array, left, eqLeft - 1);

            // Recursively sort the greater-than region
            // (Elements equal to pivot are already in final position!)
            QuickSort3Way(array, eqRight + 1, right);
        }
    }

    /// <summary>
    /// 3-way partition: splits into <pivot, =pivot, >pivot regions.
    /// </summary>
    private static (int, int) Partition3Way(int[] array, int left, int right)
    {
        int pivot = array[right];
        int lt = left;      // Points to last element < pivot
        int gt = right - 1; // Points to first element > pivot
        int i = left;       // Current scanning position

        while (i <= gt)
        {
            if (array[i] < pivot)
            {
                // Element is less than pivot, move to left section
                Swap(array, i, lt);
                lt++;
                i++;
            }
            else if (array[i] > pivot)
            {
                // Element is greater than pivot, move to right section
                Swap(array, i, gt);
                gt--;
                // Don't increment i, we need to check the swapped element
            }
            else
            {
                // Element equals pivot, leave it in the middle
                i++;
            }
        }

        // Place pivot between equals regions
        Swap(array, right, gt + 1);

        // Return the boundaries of the equals region
        return (lt, gt + 1);
    }

    private static void Swap(int[] array, int i, int j)
    {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/// <summary>
/// Iterative (non-recursive) QuickSort using an explicit stack.
///
/// WHY ITERATIVE?
/// - Avoids call-stack overflow on very large arrays
/// - No function call overhead — can be slightly faster
/// - Still O(n log n) average; simulates recursion with a manual stack
/// </summary>
public class IterativeQuickSort
{
    /// <summary>
    /// Sorts array iteratively using an explicit stack instead of recursion.
    /// </summary>
    public static void Sort(int[] array)
    {
        if (array == null || array.Length < 2)
            return;

        int left = 0;
        int right = array.Length - 1;

        // Use an explicit stack to simulate recursive calls
        // Each stack entry is a (left, right) pair representing a subarray to sort
        int[] stack = new int[right - left + 1];
        int stackTop = -1;

        // Push the initial bounds onto the stack
        stack[++stackTop] = left;
        stack[++stackTop] = right;

        // Process the stack until empty (like unwinding recursive calls)
        while (stackTop >= 0)
        {
            // Pop the right and left bounds
            right = stack[stackTop--];
            left  = stack[stackTop--];

            // Partition the subarray and get the pivot's final position
            int pivotIndex = Partition(array, left, right);

            // If there are elements on the LEFT of pivot, push to stack
            if (pivotIndex - 1 > left)
            {
                stack[++stackTop] = left;
                stack[++stackTop] = pivotIndex - 1;
            }

            // If there are elements on the RIGHT of pivot, push to stack
            if (pivotIndex + 1 < right)
            {
                stack[++stackTop] = pivotIndex + 1;
                stack[++stackTop] = right;
            }
        }
    }

    private static int Partition(int[] array, int left, int right)
    {
        int pivot = array[right];
        int indexOfSmaller = left - 1;

        for (int i = left; i < right; i++)
        {
            if (array[i] <= pivot)
            {
                indexOfSmaller++;
                Swap(array, indexOfSmaller, i);
            }
        }

        Swap(array, indexOfSmaller + 1, right);
        return indexOfSmaller + 1;
    }

    private static void Swap(int[] array, int i, int j)
    {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// ──────────────────────────────────────────────────────────────
// Helper functions for the benchmark below
// ──────────────────────────────────────────────────────────────
static int[] GenerateLargeArray(int size)
{
    var rand = new Random(42);
    return Enumerable.Range(0, size).Select(_ => rand.Next()).ToArray();
}

static int[] GenerateArrayWithDuplicates(int size)
{
    var rand = new Random(42);
    return Enumerable.Range(0, size).Select(_ => rand.Next(1, 10)).ToArray();
}

using System.Diagnostics;
using System.Linq;

int[] array = GenerateLargeArray(100000);

// Test 1: Randomized recursive
var sw = Stopwatch.StartNew();
OptimizedQuickSort.Sort((int[])array.Clone());
sw.Stop();
Console.WriteLine($"Randomized Recursive: {sw.ElapsedMilliseconds}ms");

// Test 2: Tail-optimized
sw = Stopwatch.StartNew();
TailOptimizedQuickSort.Sort((int[])array.Clone());
sw.Stop();
Console.WriteLine($"Tail-Optimized: {sw.ElapsedMilliseconds}ms");

// Test 3: Fully iterative
sw = Stopwatch.StartNew();
IterativeQuickSort.Sort((int[])array.Clone());
sw.Stop();
Console.WriteLine($"Iterative: {sw.ElapsedMilliseconds}ms");

// Test 4: 3-way (with duplicates)
int[] arrayWithDupes = GenerateArrayWithDuplicates(100000);
sw = Stopwatch.StartNew();
ThreeWayQuickSort.Sort(arrayWithDupes);
sw.Stop();
Console.WriteLine($"3-Way (Many Dupes): {sw.ElapsedMilliseconds}ms");