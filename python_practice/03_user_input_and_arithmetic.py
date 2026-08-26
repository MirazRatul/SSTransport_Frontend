"""
Problem 03: User Input & Basic Arithmetic Operations
---------------------------------------------------
Question:
Write a Python program that accepts two numbers (or uses default sample numbers)
and demonstrates all standard arithmetic operations: addition, subtraction,
multiplication, division, floor division, modulus, and exponentiation.
"""

def perform_arithmetic(a: float, b: float):
    print(f"Number A: {a}")
    print(f"Number B: {b}")
    print("-" * 30)
    print(f"Addition (a + b)         : {a + b}")
    print(f"Subtraction (a - b)      : {a - b}")
    print(f"Multiplication (a * b)   : {a * b}")
    print(f"Division (a / b)         : {a / b if b != 0 else 'Error (Div by 0)'}")
    print(f"Floor Division (a // b)  : {a // b if b != 0 else 'Error (Div by 0)'}")
    print(f"Modulus (a % b)          : {a % b if b != 0 else 'Error (Div by 0)'}")
    print(f"Exponentiation (a ** b)  : {a ** b}")

def main():
    print("=== Arithmetic Operations Demonstration ===")
    num1 = 15.0
    num2 = 4.0
    perform_arithmetic(num1, num2)

if __name__ == "__main__":
    main()
