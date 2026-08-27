"""
Problem 21: Binary Search Algorithm
------------------------------------
Question:
Write iterative and recursive implementations of Binary Search to find the index 
of a target element in a sorted list. Return -1 if the target is not present.
Time Complexity: O(log N).
"""

def binary_search_iterative(arr: list, target: int) -> int:
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1

def binary_search_recursive(arr: list, target: int, low: int, high: int) -> int:
    if low > high:
        return -1
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, high)
    else:
        return binary_search_recursive(arr, target, low, mid - 1)

def main():
    sorted_numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    targets = [23, 91, 100]

    print("=== Binary Search Demonstration ===")
    print(f"Sorted List: {sorted_numbers}\n")

    for target in targets:
        idx_iter = binary_search_iterative(sorted_numbers, target)
        idx_rec = binary_search_recursive(sorted_numbers, target, 0, len(sorted_numbers) - 1)
        print(f"Target: {target:3d} | Iterative Index: {idx_iter:2d} | Recursive Index: {idx_rec:2d}")

if __name__ == "__main__":
    main()
