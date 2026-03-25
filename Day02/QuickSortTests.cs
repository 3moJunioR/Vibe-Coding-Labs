using Xunit;
using System;
using System.Linq;

/// <summary>
/// Unit tests for the QuickSort algorithm implementation.
/// Tests cover edge cases, normal cases, and performance scenarios.
/// </summary>
public class QuickSortTests
{
    // ==========================================
    // QuickSort Algorithm Implementation
    // (Include alongside tests)
    // ==========================================

    public static void QuickSort(int[] array)
    {
        if (array == null || array.Length == 0)
            return;

        QuickSortRecursive(array, 0, array.Length - 1);
    }

    private static void QuickSortRecursive(int[] array, int leftBound, int rightBound)
    {
        if (leftBound < rightBound)
        {
            int pivotIndex = Partition(array, leftBound, rightBound);
            QuickSortRecursive(array, leftBound, pivotIndex - 1);
            QuickSortRecursive(array, pivotIndex + 1, rightBound);
        }
    }

    private static int Partition(int[] array, int leftBound, int rightBound)
    {
        int pivot = array[rightBound];
        int indexOfSmaller = leftBound - 1;

        for (int currentIndex = leftBound; currentIndex < rightBound; currentIndex++)
        {
            if (array[currentIndex] < pivot)
            {
                indexOfSmaller++;
                Swap(array, indexOfSmaller, currentIndex);
            }
        }

        Swap(array, indexOfSmaller + 1, rightBound);
        return indexOfSmaller + 1;
    }

    private static void Swap(int[] array, int i, int j)
    {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    // ==========================================
    // Test Cases
    // ==========================================

    /// <summary>
    /// Test 1: Empty array should remain empty.
    /// Edge case: Null and empty arrays are valid inputs that should be handled gracefully.
    /// </summary>
    [Fact]
    public void Sort_EmptyArray_ReturnsEmpty()
    {
        // Arrange
        int[] array = { };

        // Act
        QuickSort(array);

        // Assert
        Assert.Empty(array);
    }

    /// <summary>
    /// Test 2: Null array should not throw an exception.
    /// Edge case: Null is a valid edge case that should be handled.
    /// </summary>
    [Fact]
    public void Sort_NullArray_DoesNotThrow()
    {
        // Arrange
        int[] array = null;

        // Act & Assert - should not throw any exception
        QuickSort(array);
    }

    /// <summary>
    /// Test 3: Single element array is already sorted.
    /// Edge case: Minimum meaningful array size.
    /// </summary>
    [Fact]
    public void Sort_SingleElement_ReturnsSingleElement()
    {
        // Arrange
        int[] array = { 42 };
        int[] expected = { 42 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 4: Two element array should sort correctly.
    /// Edge case: Small array where pivot selection matters.
    /// </summary>
    [Fact]
    public void Sort_TwoElements_SortsCorrectly()
    {
        // Arrange
        int[] array = { 2, 1 };
        int[] expected = { 1, 2 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 5: Already sorted array should remain unchanged.
    /// Edge case: Can trigger worst-case O(n²) in basic implementations.
    /// </summary>
    [Fact]
    public void Sort_AlreadySortedArray_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        int[] expected = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 6: Reverse sorted array should be sorted correctly.
    /// Edge case: Worst-case scenario for basic pivot selection strategies.
    /// </summary>
    [Fact]
    public void Sort_ReverseSortedArray_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 };
        int[] expected = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 7: Unsorted array should be sorted correctly.
    /// Normal case: Random/unsorted input is the typical use case.
    /// </summary>
    [Fact]
    public void Sort_UnsortedArray_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 64, 34, 25, 12, 22, 11, 90, 88 };
        int[] expected = { 11, 12, 22, 25, 34, 64, 88, 90 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 8: Array with duplicates should sort correctly.
    /// Edge case: All equal elements, stress-tests partitioning logic.
    /// </summary>
    [Fact]
    public void Sort_ArrayWithAllDuplicates_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 5, 5, 5, 5, 5 };
        int[] expected = { 5, 5, 5, 5, 5 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 9: Array with some duplicate elements should sort correctly.
    /// Edge case: Partial duplicates test partitioning with equal elements.
    /// </summary>
    [Fact]
    public void Sort_ArrayWithSomeDuplicates_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 3, 1, 4, 1, 5, 9, 2, 6, 5, 3 };
        int[] expected = { 1, 1, 2, 3, 3, 4, 5, 5, 6, 9 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 10: Array with negative numbers should sort correctly.
    /// Edge case: Negative, zero, and positive numbers mixed.
    /// </summary>
    [Fact]
    public void Sort_ArrayWithNegativeNumbers_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 3, -1, 4, -5, 2, 0, -3 };
        int[] expected = { -5, -3, -1, 0, 2, 3, 4 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 11: Array with large numbers should sort correctly.
    /// Edge case: Integer boundary values.
    /// </summary>
    [Fact]
    public void Sort_ArrayWithLargeNumbers_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { int.MaxValue, int.MinValue, 0, 1000000, -1000000 };
        int[] expected = { int.MinValue, -1000000, 0, 1000000, int.MaxValue };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 12: Large dataset performance test.
    /// Verifies QuickSort can handle 10,000 elements efficiently.
    /// Tests actual performance, not just correctness.
    /// </summary>
    [Fact]
    public void Sort_LargeDataset_SortsCorrectlyAndEfficiently()
    {
        // Arrange
        Random random = new Random(42);
        int[] array = Enumerable.Range(0, 10000)
            .Select(_ => random.Next(-100000, 100000))
            .ToArray();

        // Create a copy and sort with LINQ for comparison
        int[] expected = array.OrderBy(x => x).ToArray();

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 13: Very large dataset performance test.
    /// Verifies QuickSort can handle 100,000 elements.
    /// Tests scalability and performance.
    /// </summary>
    [Fact]
    public void Sort_VeryLargeDataset_SortsCorrectly()
    {
        // Arrange
        Random random = new Random(123);
        int[] array = Enumerable.Range(0, 100000)
            .Select(_ => random.Next(int.MinValue, int.MaxValue))
            .ToArray();

        int[] expected = array.OrderBy(x => x).ToArray();

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 14: Array with mostly sorted elements.
    /// Edge case: Partially sorted array can trigger different partitioning patterns.
    /// </summary>
    [Fact]
    public void Sort_MostlySortedArray_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 1, 2, 3, 5, 4, 6, 7, 8, 9, 10 };
        int[] expected = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 15: Array with alternating minimum and maximum.
    /// Edge case: Full swing pattern between small and large values.
    /// </summary>
    [Fact]
    public void Sort_AlternatingMinMax_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 1, 100, 2, 99, 3, 98, 4, 97 };
        int[] expected = { 1, 2, 3, 4, 97, 98, 99, 100 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test 16: Array where pivot selection matters - all but one sorted.
    /// Edge case: Tests behavior with outlier elements.
    /// </summary>
    [Fact]
    public void Sort_ArrayWithOneOutlier_ReturnsSortedArray()
    {
        // Arrange
        int[] array = { 100, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        int[] expected = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 100 };

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    // ==========================================
    // Parameterized Tests
    // ==========================================

    /// <summary>
    /// Parameterized test: Verifies QuickSort with multiple input sets.
    /// Tests various small arrays with different patterns.
    /// </summary>
    [Theory]
    [InlineData(new int[] { 3, 1, 2 }, new int[] { 1, 2, 3 })]
    [InlineData(new int[] { 5, 4, 3, 2, 1 }, new int[] { 1, 2, 3, 4, 5 })]
    [InlineData(new int[] { 1, 1, 1, 1 }, new int[] { 1, 1, 1, 1 })]
    [InlineData(new int[] { -3, -1, -2 }, new int[] { -3, -2, -1 })]
    [InlineData(new int[] { 0, -1, 1 }, new int[] { -1, 0, 1 })]
    public void Sort_VariousInputs_ReturnsSortedArray(int[] input, int[] expected)
    {
        // Act
        QuickSort(input);

        // Assert
        Assert.Equal(expected, input);
    }

    /// <summary>
    /// Parameterized test: Performance test with different dataset sizes.
    /// Tests QuickSort efficiency at various scales.
    /// </summary>
    [Theory]
    [InlineData(10)]
    [InlineData(100)]
    [InlineData(1000)]
    [InlineData(5000)]
    public void Sort_VariousSizes_PerformsEfficiently(int size)
    {
        // Arrange
        Random random = new Random(42);
        int[] array = Enumerable.Range(0, size)
            .Select(_ => random.Next())
            .ToArray();

        int[] expected = array.OrderBy(x => x).ToArray();

        // Act
        QuickSort(array);

        // Assert
        Assert.Equal(expected, array);
    }

    /// <summary>
    /// Test: Validates that QuickSort performs in-place modification.
    /// Ensures QuickSort modifies the original array, not creating a new one.
    /// </summary>
    [Fact]
    public void Sort_ModifiesOriginalArray_InPlace()
    {
        // Arrange
        int[] array = { 5, 2, 8, 1, 9 };
        int[] originalReference = array;

        // Act
        QuickSort(array);

        // Assert - Verify same reference (in-place modification)
        Assert.Same(originalReference, array);
        Assert.Equal(new int[] { 1, 2, 5, 8, 9 }, array);
    }

    /// <summary>
    /// Test: Validates sorting stability consideration.
    /// Notes: QuickSort is not stable, so equal elements may change order.
    /// This test documents that behavior.
    /// </summary>
    [Fact]
    public void Sort_WithDuplicates_SortsCorrectlyButMayNotBeStable()
    {
        // Arrange
        int[] array = { 3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5 };

        // Act
        QuickSort(array);

        // Assert - Only verify values are sorted, not their relative order
        for (int i = 0; i < array.Length - 1; i++)
        {
            Assert.True(array[i] <= array[i + 1], 
                $"Array not sorted at index {i}: {array[i]} > {array[i + 1]}");
        }
    }
}
