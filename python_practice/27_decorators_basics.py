"""
Problem 27: Custom Decorators & Execution Timer
------------------------------------------------
Question:
Write a custom decorator `@timer` that measures and prints the execution time 
of any decorated Python function, preserving the original function's metadata using `functools.wraps`.
"""

import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        execution_time = end_time - start_time
        print(f"[Timer] Function '{func.__name__}' took {execution_time * 1000:.4f} ms to execute.")
        return result
    return wrapper

@timer
def compute_sum_of_squares(n: int) -> int:
    return sum(i * i for i in range(n))

@timer
def simulate_heavy_computation():
    time.sleep(0.05)  # Simulate delay
    return "Done"

def main():
    print("=== Custom Decorators Demo ===")
    res1 = compute_sum_of_squares(1_000_000)
    print(f"Result 1: {res1}")

    res2 = simulate_heavy_computation()
    print(f"Result 2: {res2}")

if __name__ == "__main__":
    main()
