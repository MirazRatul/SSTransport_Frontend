"""
Problem 20: Bubble Sort Algorithm Implementation
------------------------------------------------
Question:
Implement the Bubble Sort algorithm in Python to sort an array/list of numbers 
in ascending order. Include an optimization (swapped flag) to stop early if the list 
is already sorted.
"""

def bubble_sort(arr: list) -> list:
    n = len(arr)
    sorted_arr = arr.copy()
    
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if sorted_arr[j] > sorted_arr[j + 1]:
                # Swap adjacent elements
                sorted_arr[j], sorted_arr[j + 1] = sorted_arr[j + 1], sorted_arr[j]
                swapped = True
        # If no elements were swapped in inner loop, array is sorted
        if not swapped:
            break

    return sorted_arr

def main():
    sample_list = [64, 34, 25, 12, 22, 11, 90]
    print("=== Bubble Sort Algorithm ===")
    print(f"Unsorted List : {sample_list}")
    
    sorted_list = bubble_sort(sample_list)
    print(f"Sorted List   : {sorted_list}")

if __name__ == "__main__":
    main()
