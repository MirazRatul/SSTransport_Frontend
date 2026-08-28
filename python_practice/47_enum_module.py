"""
Problem 47: Enumerations in Python (`enum.Enum`, `IntEnum`, `auto`)
-------------------------------------------------------------------
Question:
Write Python code using the `enum` module (`Enum`, `IntEnum`, `auto`) to define 
type-safe enumerations for Order Statuses and Priority Levels with custom methods.
"""

from enum import Enum, IntEnum, auto

class OrderStatus(Enum):
    PENDING = auto()
    PROCESSING = auto()
    SHIPPED = auto()
    DELIVERED = auto()
    CANCELLED = auto()

    def is_terminal(self) -> bool:
        return self in (OrderStatus.DELIVERED, OrderStatus.CANCELLED)

class PriorityLevel(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

def main():
    print("=== Enum Module Demonstration ===")
    
    current_status = OrderStatus.SHIPPED
    print(f"Order Status: {current_status.name} (Value: {current_status.value})")
    print(f"Is status terminal? {current_status.is_terminal()}")

    terminal_status = OrderStatus.DELIVERED
    print(f"Status '{terminal_status.name}' is terminal? {terminal_status.is_terminal()}")

    # IntEnum comparisons
    p_high = PriorityLevel.HIGH
    p_low = PriorityLevel.LOW
    print(f"\nPriority Comparison: {p_high.name} ({p_high.value}) > {p_low.name} ({p_low.value}) ? {p_high > p_low}")

if __name__ == "__main__":
    main()
