"""
Problem 16: Prime Number Checker & Generator
----------------------------------------------
Question:
1. Write an efficient function `is_prime(n)` to determine if a integer `n` is prime.
2. Write a function `generate_primes(limit)` to produce all prime numbers up to `limit`.
"""

import math

def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # Check factors up to square root of n
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def generate_primes(limit: int) -> list:
    return [num for num in range(2, limit + 1) if is_prime(num)]

def main():
    print("=== Prime Number Checker ===")
    test_numbers = [1, 2, 4, 13, 17, 25, 29, 97, 100]
    
    for num in test_numbers:
        status = "PRIME" if is_prime(num) else "COMPOSITE / NOT PRIME"
        print(f"Number {num:3d} : {status}")

    print("\n=== Prime Numbers Up to 50 ===")
    primes_up_to_50 = generate_primes(50)
    print(primes_up_to_50)

if __name__ == "__main__":
    main()
