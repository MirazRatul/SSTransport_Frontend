"""
Problem 22: Custom Stack Class (LIFO)
--------------------------------------
Question:
Implement a Stack data structure using Object-Oriented Programming in Python 
with push, pop, peek, is_empty, and size methods.
LIFO = Last-In, First-Out.
"""

class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self._items[-1]

    def is_empty(self) -> bool:
        return len(self._items) == 0

    def size(self) -> int:
        return len(self._items)

    def __str__(self):
        return f"Stack({self._items})"

def main():
    print("=== Custom Stack (LIFO) Demo ===")
    stack = Stack()
    
    print(f"Is Stack Empty? {stack.is_empty()}")
    
    # Push elements
    stack.push(10)
    stack.push(20)
    stack.push(30)
    print(f"Stack after pushes: {stack}")
    print(f"Top element (peek): {stack.peek()}")
    
    # Pop elements
    print(f"Popped element: {stack.pop()}")
    print(f"Stack after pop: {stack}")
    print(f"Current Stack Size: {stack.size()}")

if __name__ == "__main__":
    main()
