"""
Problem 05: Find Largest Among Three Numbers
---------------------------------------------
Question:
Write a Python script that compares three numbers and finds the largest number 
using conditional statements (if-elif-else) as well as the built-in max() function.
"""

def find_largest_conditional(a: float, b: float, c: float) -> float:
    if a >= b and a >= c:
        return a
    elif b >= a and b >= c:
        return b
    else:
        return c

def main():
    num1, num2, num3 = 24.5, 89.2, 57.8
    print("=== Find Largest Number ===")
    print(f"Input Numbers: {num1}, {num2}, {num3}")
    
    largest_if = find_largest_conditional(num1, num2, num3)
    largest_builtin = max(num1, num2, num3)

    print(f"Largest using if-elif-else: {largest_if}")
    print(f"Largest using max() function: {largest_builtin}")

if __name__ == "__main__":
    main()
