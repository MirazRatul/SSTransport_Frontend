"""
Problem 40: Multi-threading & Concurrent Execution
--------------------------------------------------
Question:
Write a Python program using the `threading` module to execute concurrent tasks 
(e.g., simulating worker threads downloading files) safely using `threading.Thread` and `threading.Lock`.
"""

import threading
import time

# Shared counter protected by a lock
counter = 0
counter_lock = threading.Lock()

def worker_task(thread_id: int, iterations: int):
    global counter
    print(f"[Thread {thread_id}] Started.")
    for _ in range(iterations):
        time.sleep(0.01)  # Simulate I/O bound work
        with counter_lock:
            counter += 1
    print(f"[Thread {thread_id}] Finished.")

def main():
    global counter
    counter = 0
    num_threads = 4
    iterations_per_thread = 5
    threads = []

    print("=== Multi-threading Demonstration ===")
    start_time = time.perf_counter()

    for i in range(1, num_threads + 1):
        t = threading.Thread(target=worker_task, args=(i, iterations_per_thread))
        threads.append(t)
        t.start()

    # Wait for all threads to complete
    for t in threads:
        t.join()

    elapsed = time.perf_counter() - start_time
    expected_total = num_threads * iterations_per_thread

    print(f"\nFinal Counter Value : {counter} (Expected: {expected_total})")
    print(f"Total Execution Time: {elapsed * 1000:.2f} ms")

if __name__ == "__main__":
    main()
