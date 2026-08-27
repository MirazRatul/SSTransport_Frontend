"""
Problem 29: Functional Programming (`lambda`, `map`, `filter`, `reduce`)
------------------------------------------------------------------------
Question:
Demonstrate functional programming concepts in Python:
1. Use `lambda` expressions to create inline anonymous functions.
2. Use `map()` to double a list of numbers.
3. Use `filter()` to extract odd numbers.
4. Use `functools.reduce()` to compute product of a list of numbers.
"""

from functools import reduce

def main():
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    print(f"=== Original List: {numbers} ===\n")

    # 1. Lambda & Map: Double each number
    doubled = list(map(lambda x: x * 2, numbers))
    print(f"1. Doubled (map)    : {doubled}")

    # 2. Lambda & Filter: Keep odd numbers
    odds = list(filter(lambda x: x % 2 != 0, numbers))
    print(f"2. Odd Numbers (filter): {odds}")

    # 3. Lambda & Reduce: Multiply all numbers together
    product = reduce(lambda x, y: x * y, numbers)
    print(f"3. Product (reduce)  : {product}")

    # 4. Sorting with custom lambda key
    students = [("Alice", 88), ("Bob", 95), ("Charlie", 78)]
    sorted_by_grade = sorted(students, key=lambda student: student[1], reverse=True)
    print(f"4. Sorted by Grade   : {sorted_by_grade}")

if __name__ == "__main__":
    main()
