"""
Problem 09: Multiplication Table Generator
-------------------------------------------
Question:
Write a Python program to generate and display formatted multiplication tables 
for a given number up to a specified upper bound (default up to 10).
"""

def print_multiplication_table(number: int, limit: int = 10):
    print(f"--- Multiplication Table for {number} ---")
    for i in range(1, limit + 1):
        print(f"{number:2d} x {i:2d} = {number * i:4d}")

def main():
    print("=== Multiplication Table Generator ===")
    print_multiplication_table(7)
    print()
    print_multiplication_table(12, limit=5)

if __name__ == "__main__":
    main()
