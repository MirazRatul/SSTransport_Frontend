"""
Problem 26: Exception Handling (try-except-else-finally)
---------------------------------------------------------
Question:
Write a Python program that safely divides two numbers provided by a caller, 
handling `ZeroDivisionError`, `TypeError`, and `ValueError`, utilizing `try`, 
`except`, `else`, and `finally` blocks.
"""

def safe_divide(a, b):
    print(f"\nAttempting division: {a} / {b}")
    try:
        num_a = float(a)
        num_b = float(b)
        result = num_a / num_b
    except ZeroDivisionError:
        print("[Error] Cannot divide by zero!")
        return None
    except ValueError:
        print("[Error] Invalid input: Could not convert input to a number!")
        return None
    except Exception as e:
        print(f"[Error] Unexpected error occurred: {e}")
        return None
    else:
        print(f"[Success] Division result: {result}")
        return result
    finally:
        print("[Clean Up] Division operation completed.")

def main():
    print("=== Exception Handling Demonstration ===")
    test_cases = [
        (10, 2),
        (5, 0),
        ("100", "4"),
        ("abc", 5)
    ]

    for x, y in test_cases:
        safe_divide(x, y)

if __name__ == "__main__":
    main()
