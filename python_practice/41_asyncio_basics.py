"""
Problem 41: Asynchronous Programming (`asyncio`, `async/await`)
----------------------------------------------------------------
Question:
Write an asynchronous Python program using `asyncio` to simulate fetching data concurrently 
from multiple API endpoints using `async`, `await`, and `asyncio.gather()`.
"""

import asyncio
import time

async def fetch_api_data(endpoint_id: int, delay_seconds: float) -> dict:
    print(f"[Async] Requesting Endpoint {endpoint_id}...")
    await asyncio.sleep(delay_seconds)  # Non-blocking async sleep
    print(f"[Async] Received response from Endpoint {endpoint_id}.")
    return {"endpoint": endpoint_id, "status": 200, "data": f"Payload {endpoint_id}"}

async def main_async():
    print("=== Asynchronous Programming with asyncio ===")
    start_time = time.perf_counter()

    # Schedule concurrent coroutines
    tasks = [
        fetch_api_data(1, 0.1),
        fetch_api_data(2, 0.05),
        fetch_api_data(3, 0.15),
    ]

    # Gather results concurrently
    results = await asyncio.gather(*tasks)

    elapsed = time.perf_counter() - start_time
    print(f"\nFetched {len(results)} responses concurrently in {elapsed * 1000:.2f} ms:")
    for res in results:
        print(f"  - {res}")

def main():
    asyncio.run(main_async())

if __name__ == "__main__":
    main()
