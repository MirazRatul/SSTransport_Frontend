"""
Problem 28: Iterators & Generators (`yield`)
--------------------------------------------
Question:
Write generator functions using the `yield` keyword:
1. `square_generator(n)`: Generates square of numbers from 1 to n.
2. `fibonacci_generator(limit)`: Yields Fibonacci numbers up to a given limit.
Explain how generators save memory compared to lists.
"""

def square_generator(n: int):
    for i in range(1, n + 1):
        yield i * i

def fibonacci_generator(limit: int):
    a, b = 0, 1
    count = 0
    while count < limit:
        yield a
        a, b = b, a + b
        count += 1

def main():
    print("=== Generator (`yield`) Demonstration ===")
    
    print("\nSquare Generator (First 5 Squares):")
    for sq in square_generator(5):
        print(sq, end=" ")
    print()

    print("\nFibonacci Generator (First 10 Fibonacci Numbers):")
    fib_gen = fibonacci_generator(10)
    print(list(fib_gen))

if __name__ == "__main__":
    main()
