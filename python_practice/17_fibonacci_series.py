"""
Problem 17: Fibonacci Sequence Generator
-----------------------------------------
Question:
Write Python functions to:
1. Generate the first N terms of the Fibonacci sequence iteratively.
2. Return the N-th Fibonacci number using recursion.
Formula: F(0)=0, F(1)=1, F(n) = F(n-1) + F(n-2)
"""

def generate_fibonacci(n: int) -> list:
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

def fibonacci_recursive(n: int) -> int:
    if n < 0:
        raise ValueError("N must be a non-negative integer.")
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

def main():
    terms = 12
    print(f"=== Fibonacci Sequence (First {terms} Terms) ===")
    fib_series = generate_fibonacci(terms)
    print(f"Iterative Series: {fib_series}")

    print("\nRecursive 8th Fibonacci Term:")
    print(f"F(8) = {fibonacci_recursive(8)}")

if __name__ == "__main__":
    main()
