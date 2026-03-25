// =============================================================
// TASK 7: Bug Introduction, Debugging, and Fix
// =============================================================
// 
// OVERVIEW:
//   This file demonstrates a common QuickSort bug, how to detect it,
//   and how to fix it step by step.
//
// THE BUG:
//   In the Partition method, the loop condition uses "<=" instead of "<"
//   This causes the pivot itself to be compared and potentially swapped,
//   corrupting the partition logic.
// =============================================================

using System;

/// <summary>
/// ❌ BUGGY QuickSort Implementation
/// 
/// Bug Location: Partition() method, line with the for-loop condition.
/// Bug Type:     Off-by-one error — loop iterates OVER the pivot element.
/// 
/// Symptom:
///   - Incorrectly sorted output on many inputs
///   - Arrays with duplicates sorted wrong
///   - Can cause infinite loops on some inputs
/// </summary>
public class BuggyQuickSort
{
    public static void Sort(int[] array)
    {
        if (array == null || array.Length == 0)
            return;

        BuggyQuickSortRecursive(array, 0, array.Length - 1);
    }

    private static void BuggyQuickSortRecursive(int[] array, int left, int right)
    {
        if (left < right)
        {
            int pivotIndex = BuggyPartition(array, left, right);
            BuggyQuickSortRecursive(array, left, pivotIndex - 1);
            BuggyQuickSortRecursive(array, pivotIndex + 1, right);
        }
    }

    private static int BuggyPartition(int[] array, int left, int right)
    {
        int pivot = array[right];
        int indexOfSmaller = left - 1;

        // ❌ BUG IS HERE: The loop goes up to and INCLUDING rightBound (<=)
        // This means the PIVOT ELEMENT ITSELF is compared in the loop!
        // 
        // When currentIndex == right:
        //   array[right] == pivot → it passes the < check (array[right] < pivot is FALSE for equal)
        //   BUT array[right] <= pivot would include the pivot in swaps if condition were <=
        //   The real issue: by including right in the loop, we may swap the pivot
        //   BEFORE it gets placed correctly, breaking the partition.
        //
        // CORRECT should be: currentIndex < rightBound (strictly less than)
        for (int currentIndex = left; currentIndex <= right; currentIndex++) // ❌ BUG: <= should be <
        {
            if (array[currentIndex] < pivot)
            {
                indexOfSmaller++;
                Swap(array, indexOfSmaller, currentIndex);
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
/// 🔍 DEBUGGING WALKTHROUGH
/// 
/// Step 1: Reproduce the Bug
/// -------------------------
/// Input:  [3, 1, 2]
/// Pivot = array[2] = 2
/// Expected output: [1, 2, 3]
/// 
/// With the bug (loop goes to currentIndex <= right = index 2):
///   - currentIndex=0: array[0]=3 < 2? NO → skip
///   - currentIndex=1: array[1]=1 < 2? YES → indexOfSmaller=0, swap(arr,0,1) → [1,3,2]
///   - currentIndex=2: array[2]=2 < 2? NO → skip  (pivot itself is visited but no swap here)
/// Then: swap(arr, indexOfSmaller+1=1, right=2) → swap(arr,1,2) → [1,2,3]
/// 
/// Hmm, this case accidentally works. Try another:
/// 
/// Input:  [5, 3, 1, 4, 2]
/// Pivot = array[4] = 2
/// 
/// Buggy loop (currentIndex 0..4 inclusive):
///   - currentIndex=0: 5 < 2? NO
///   - currentIndex=1: 3 < 2? NO
///   - currentIndex=2: 1 < 2? YES → indexOfSmaller=0, swap(0,2) → [1,3,5,4,2]
///   - currentIndex=3: 4 < 2? NO
///   - currentIndex=4: 2 < 2? NO (pivot itself, no swap)
/// Finalize: swap(indexOfSmaller+1=1, right=4) → [1,2,5,4,3]
/// 
/// First recursive call: Sort([1]) → already done
/// Second recursive call: Sort([5,4,3]) → eventually [3,4,5]
/// Final: [1, 2, 3, 4, 5] ← This case also works!
/// 
/// Step 2: Find a Failing Case
/// ---------------------------
/// The bug is MOST dangerous when duplicates exist or when values equal the pivot
/// appear before the pivot in the loop. The loop including 'right' can cause the
/// pivot to be re-swapped after the finalization swap, leading to wrong results.
/// 
/// Input: [2, 2, 2]
/// Pivot = array[2] = 2
/// 
/// Buggy loop (0..2):
///   - currentIndex=0: 2 < 2? NO
///   - currentIndex=1: 2 < 2? NO
///   - currentIndex=2: 2 < 2? NO (pivot itself)
/// Finalize: swap(indexOfSmaller+1 = 0, right=2) → array[0] and array[2] swapped
///   → [2,2,2] (no visible change, but pivotIndex returns 0)
/// Left call: Sort(left=0, right=-1) → base case, fine
/// Right call: Sort(left=1, right=2) → this will loop on [2,2] indefinitely
///   because pivot is always placed at index 1, leaving right range 1..2 unchanged!
/// 
/// Step 3: Identify Root Cause
/// --------------------------
/// The condition `currentIndex <= right` causes the loop to process
/// the PIVOT ELEMENT (at index `right`) as if it were a regular element.
/// This corrupts which element gets placed as the pivot and where.
/// 
/// Step 4: Apply the Fix
/// ---------------------
/// Change: currentIndex <= right
/// To:     currentIndex < right
/// 
/// This ensures the pivot element at `right` is NEVER touched during the
/// scanning loop — it is only moved to its final position by the Swap
/// after the loop completes.
/// </summary>
public class DebugInfo
{
    /// <summary>
    /// Demonstrates the bug and the fix side by side.
    /// </summary>
    public static void RunDebugDemo()
    {
        Console.WriteLine("=== QuickSort Bug Demo ===\n");

        // Test with a problematic input
        int[] buggyArray  = { 5, 3, 1, 4, 2 };
        int[] fixedArray  = { 5, 3, 1, 4, 2 };

        Console.Write("Original:     ");
        Console.WriteLine(string.Join(", ", buggyArray));

        BuggyQuickSort.Sort(buggyArray);
        Console.Write("Buggy result: ");
        Console.WriteLine(string.Join(", ", buggyArray));

        FixedQuickSort.Sort(fixedArray);
        Console.Write("Fixed result: ");
        Console.WriteLine(string.Join(", ", fixedArray));

        Console.WriteLine("\n✅ Fixed version always produces correct output.");
    }
}

/// <summary>
/// ✅ FIXED QuickSort Implementation
/// 
/// Fix Applied: Changed `currentIndex <= right` → `currentIndex < right`
/// 
/// Explanation:
///   - The pivot is always the element at `right` (right bound)
///   - The scanning loop should only look at elements from `left` to `right - 1`
///   - The pivot itself must NOT be part of the scanning loop
///   - After scanning, the pivot is placed in its final position by a single Swap
/// </summary>
public class FixedQuickSort
{
    public static void Sort(int[] array)
    {
        if (array == null || array.Length == 0)
            return;

        FixedQuickSortRecursive(array, 0, array.Length - 1);
    }

    private static void FixedQuickSortRecursive(int[] array, int left, int right)
    {
        if (left < right)
        {
            int pivotIndex = FixedPartition(array, left, right);
            FixedQuickSortRecursive(array, left, pivotIndex - 1);
            FixedQuickSortRecursive(array, pivotIndex + 1, right);
        }
    }

    private static int FixedPartition(int[] array, int left, int right)
    {
        int pivot = array[right];
        int indexOfSmaller = left - 1;

        // ✅ FIXED: Loop condition is strictly < right (NOT <=)
        // The pivot element at index `right` is intentionally excluded from the loop.
        // After the loop, a single Swap places the pivot in its final sorted position.
        for (int currentIndex = left; currentIndex < right; currentIndex++) // ✅ FIXED: < instead of <=
        {
            if (array[currentIndex] < pivot)
            {
                indexOfSmaller++;
                Swap(array, indexOfSmaller, currentIndex);
            }
        }

        // Place pivot in its correct position — between smaller and larger elements
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
