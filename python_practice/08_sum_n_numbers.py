"""
Problem 08: Sum of First N Natural Numbers
------------------------------------------
Question:
Write a Python program to calculate the sum of the first N natural numbers using:
1. A 'for' loop
2. A 'while' loop
3. Mathematical formula: N * (N + 1) // 2
"""

def sum_for_loop(n: int) -> int:
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

def sum_while_loop(n: int) -> int:
    total = 0
    current = 1
    while current <= n:
        total += current
        current += 1
    return total

def sum_formula(n: int) -> int:
    return (n * (n + 1)) // 2

def main():
    n = 100
    print(f"=== Sum of First {n} Natural Numbers ===")
    print(f"Using for loop    : {sum_for_loop(n)}")
    print(f"Using while loop  : {sum_while_loop(n)}")
    print(f"Using formula     : {sum_formula(n)}")

if __name__ == "__main__":
    main()
