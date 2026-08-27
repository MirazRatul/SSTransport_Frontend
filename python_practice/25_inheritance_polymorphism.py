"""
Problem 25: Inheritance & Polymorphism
--------------------------------------
Question:
Demonstrate object-oriented inheritance and polymorphism by creating an abstract base 
class `Shape` with subclasses `Rectangle` and `Circle`, each implementing their own 
`area()` and `perimeter()` methods.
"""

import math
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return math.pi * (self.radius ** 2)

    def perimeter(self) -> float:
        return 2 * math.pi * self.radius

def main():
    print("=== OOP Inheritance & Polymorphism Demo ===")
    shapes: list[Shape] = [
        Rectangle(10.0, 5.0),
        Circle(7.0)
    ]

    for shape in shapes:
        shape_name = shape.__class__.__name__
        print(f"Shape: {shape_name:10s} | Area: {shape.area():8.2f} | Perimeter: {shape.perimeter():8.2f}")

if __name__ == "__main__":
    main()
