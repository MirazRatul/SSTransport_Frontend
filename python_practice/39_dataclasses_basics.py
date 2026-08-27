"""
Problem 39: Modern Python Data Classes (`@dataclass`)
-----------------------------------------------------
Question:
Write a Python program utilizing the `@dataclass` decorator from `dataclasses` 
module to define structured data models with automatic `__init__`, `__repr__`, 
`__eq__`, and default field values.
"""

from dataclasses import dataclass, field
from typing import List

@dataclass(order=True)
class Product:
    id: int = field(compare=False)
    name: str = field(compare=False)
    price: float
    categories: List[str] = field(default_factory=list, compare=False)

    def apply_discount(self, percentage: float):
        self.price -= self.price * (percentage / 100)

def main():
    print("=== Modern Data Classes (@dataclass) Demo ===")
    
    p1 = Product(id=1, name="Laptop", price=1200.0, categories=["Electronics", "Computers"])
    p2 = Product(id=2, name="Mouse", price=25.0, categories=["Electronics", "Accessories"])
    p3 = Product(id=3, name="Keyboard", price=75.0, categories=["Electronics", "Accessories"])

    print(f"Product 1: {p1}")
    print(f"Product 2: {p2}")

    # Equality check built-in
    p1_copy = Product(id=1, name="Laptop", price=1200.0, categories=["Electronics", "Computers"])
    print(f"p1 == p1_copy? {p1 == p1_copy}")

    # Ordering based on price field
    products = [p1, p2, p3]
    sorted_products = sorted(products)
    print("\nProducts Sorted by Price:")
    for p in sorted_products:
        print(f"  {p.name:10s} : ${p.price:.2f}")

    # Discount application
    p1.apply_discount(10.0)
    print(f"\nAfter 10% Discount on p1: ${p1.price:.2f}")

if __name__ == "__main__":
    main()
