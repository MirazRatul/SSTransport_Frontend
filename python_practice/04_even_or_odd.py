"""
Problem 04: Check Even or Odd Number
------------------------------------
Question:
Write a Python program that checks whether a given integer is even or odd 
using conditional statements (if-else) and modulus operator.
"""

def check_even_odd(number: int) -> str:
    if number % 2 == 0:
        return f"{number} is EVEN"
    else:
        return f"{number} is ODD"

def main():
    test_numbers = [0, 7, 12, -5, 42, 99]
    print("=== Even or Odd Checker ===")
    for num in test_numbers:
        print(check_even_odd(num))

if __name__ == "__main__":
    main()
