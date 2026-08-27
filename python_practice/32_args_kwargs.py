"""
Problem 32: Variable Arguments (`*args` and `**kwargs`)
-------------------------------------------------------
Question:
Write flexible Python functions that accept variable positional arguments (`*args`) 
and variable keyword arguments (`**kwargs`), demonstrating how parameters are unpacked into tuples and dicts.
"""

def sum_all(*args: float) -> float:
    """Accepts any number of positional numeric arguments and returns their sum."""
    print(f"Positional args tuple: {args}")
    return sum(args)

def print_user_profile(username: str, **kwargs):
    """Accepts required username and any number of keyword profile attributes."""
    print(f"\nUser Profile: {username}")
    for key, value in kwargs.items():
        print(f"  - {key.capitalize()}: {value}")

def main():
    print("=== *args and **kwargs Demonstration ===")
    
    # 1. *args demo
    total = sum_all(10, 20, 30, 40, 50)
    print(f"Total Sum: {total}")

    # 2. **kwargs demo
    print_user_profile("miraj_ratul", age=24, role="Fullstack Developer", location="Dhaka", status="Active")

if __name__ == "__main__":
    main()
