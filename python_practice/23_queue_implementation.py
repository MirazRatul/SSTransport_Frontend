"""
Problem 23: Custom Queue Class (FIFO)
--------------------------------------
Question:
Implement a Queue data structure using Python's `collections.deque` for O(1) 
enqueue and dequeue performance with methods: enqueue, dequeue, front, is_empty, and size.
FIFO = First-In, First-Out.
"""

from collections import deque

class Queue:
    def __init__(self):
        self._items = deque()

    def enqueue(self, item):
        self._items.append(item)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("dequeue from empty queue")
        return self._items.popleft()

    def front(self):
        if self.is_empty():
            raise IndexError("front from empty queue")
        return self._items[0]

    def is_empty(self) -> bool:
        return len(self._items) == 0

    def size(self) -> int:
        return len(self._items)

    def __str__(self):
        return f"Queue({list(self._items)})"

def main():
    print("=== Custom Queue (FIFO) Demo ===")
    queue = Queue()

    # Enqueue customers
    queue.enqueue("Customer 1: Alice")
    queue.enqueue("Customer 2: Bob")
    queue.enqueue("Customer 3: Charlie")
    
    print(f"Queue State: {queue}")
    print(f"Front Customer: '{queue.front()}'")

    # Serving customers (Dequeue)
    print(f"Serving: {queue.dequeue()}")
    print(f"Queue State after serving 1st customer: {queue}")
    print(f"Remaining Queue Size: {queue.size()}")

if __name__ == "__main__":
    main()
