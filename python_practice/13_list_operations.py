"""
Problem 13: Basic List Manipulations
------------------------------------
Question:
Write a Python script that performs common list operations:
1. Find maximum, minimum, sum, and average of a list of numbers.
2. Filter out all even numbers into a new list.
3. Sort the list in ascending and descending order.
"""

def list_statistics(numbers: list) -> dict:
    if not numbers:
        return {}
    
    total_sum = sum(numbers)
    return {
        "max": max(numbers),
        "min": min(numbers),
        "sum": total_sum,
        "average": total_sum / len(numbers)
    }

def filter_evens(numbers: list) -> list:
    return [num for num in numbers if num % 2 == 0]

def main():
    data = [42, 17, 8, 99, 23, 54, 12, 73, 6]
    print("=== List Manipulations Demo ===")
    print(f"Original List : {data}")

    stats = list_statistics(data)
    print("\nStatistics:")
    print(f"  Maximum : {stats['max']}")
    print(f"  Minimum : {stats['min']}")
    print(f"  Sum     : {stats['sum']}")
    print(f"  Average : {stats['average']:.2f}")

    evens = filter_evens(data)
    print(f"\nFiltered Evens : {evens}")

    sorted_asc = sorted(data)
    sorted_desc = sorted(data, reverse=True)
    print(f"Sorted (Asc)   : {sorted_asc}")
    print(f"Sorted (Desc)  : {sorted_desc}")

if __name__ == "__main__":
    main()
