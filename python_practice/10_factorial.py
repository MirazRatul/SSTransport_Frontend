"""
Problem 10: Factorial of a Number
---------------------------------
Question:
Write a Python program to calculate the factorial of a given non-negative 
integer using both an iterative approach and a recursive approach.
Note: Factorial of 0 is 1 (0! = 1).
"""

def factorial_iterative(n: int) -> int:
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers.")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def factorial_recursive(n: int) -> int:
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers.")
    if n == 0 or n == 1:
        return 1
    return n * factorial_recursive(n - 1)

def main():
    print("=== Factorial Calculation Demo ===")
    test_values = [0, 1, 5, 7, 10]
    
    for val in test_values:
        iter_res = factorial_iterative(val)
        rec_res = factorial_recursive(val)
        print(f"n = {val:2d} | Iterative: {iter_res:7d} | Recursive: {rec_res:7d}")

if __name__ == "__main__":
    main()
