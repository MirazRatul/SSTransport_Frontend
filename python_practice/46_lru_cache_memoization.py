"""
Problem 46: Performance Optimization (`@functools.lru_cache`)
--------------------------------------------------------------
Question:
Demonstrate memoization and execution speed improvements using `@functools.lru_cache` 
on recursive functions like Fibonacci calculations, comparing cached vs uncached performance.
"""

import time
from functools import lru_cache

# Uncached recursive Fibonacci
def fib_uncached(n: int) -> int:
    if n < 2:
        return n
    return fib_uncached(n - 1) + fib_uncached(n - 2)

# Cached recursive Fibonacci using LRU Cache
@lru_cache(maxsize=128)
def fib_cached(n: int) -> int:
    if n < 2:
        return n
    return fib_cached(n - 1) + fib_cached(n - 2)

def main():
    print("=== LRU Cache Memoization Performance Demo ===")
    target = 33

    # 1. Measure Uncached
    start = time.perf_counter()
    res1 = fib_uncached(target)
    time1 = time.perf_counter() - start
    print(f"Uncached fib({target}) = {res1} | Time: {time1 * 1000:.2f} ms")

    # 2. Measure Cached
    start = time.perf_counter()
    res2 = fib_cached(target)
    time2 = time.perf_counter() - start
    print(f"Cached   fib({target}) = {res2} | Time: {time2 * 1000:.4f} ms")

    # Speedup factor
    speedup = time1 / time2 if time2 > 0 else float('inf')
    print(f"\nSpeedup factor: {speedup:.2f}x faster with LRU cache!")
    print(f"Cache Stats: {fib_cached.cache_info()}")

if __name__ == "__main__":
    main()
