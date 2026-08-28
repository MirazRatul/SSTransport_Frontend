"""
Problem 44: Custom Context Managers
-----------------------------------
Question:
Write custom context managers in Python using:
1. Class-based approach implementing `__enter__` and `__exit__`.
2. Generator-based approach using `contextlib.contextmanager`.
Demonstrate resource allocation, exception suppression, and cleanup.
"""

from contextlib import contextmanager
import time

# 1. Class-based Context Manager
class ManagedTimer:
    def __init__(self, label: str):
        self.label = label

    def __enter__(self):
        print(f"[{self.label}] Entering context block...")
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.perf_counter() - self.start
        print(f"[{self.label}] Exiting context block. Elapsed: {elapsed * 1000:.2f} ms")
        if exc_type is not None:
            print(f"[{self.label}] Handled Exception: {exc_val}")
        return True  # Suppress exception for demo

# 2. Generator-based Context Manager
@contextmanager
def open_resource(name: str):
    print(f"[Resource] Allocating resource: {name}")
    try:
        yield f"HANDLE:{name}"
    finally:
        print(f"[Resource] Releasing resource: {name}")

def main():
    print("=== Custom Context Managers Demo ===")
    
    with ManagedTimer("Task 1"):
        time.sleep(0.02)

    with open_resource("DatabaseConnection") as handle:
        print(f"Working with handle: {handle}")

if __name__ == "__main__":
    main()
