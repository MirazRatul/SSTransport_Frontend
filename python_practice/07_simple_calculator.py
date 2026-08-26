"""
Problem 07: Simple Calculator
------------------------------
Question:
Implement a flexible calculator function `calculate(a, b, operator)` that performs 
addition (+), subtraction (-), multiplication (*), division (/), floor division (//), 
modulus (%), and exponentiation (**).
"""

def calculate(a: float, b: float, operator: str):
    if operator == '+':
        return a + b
    elif operator == '-':
        return a - b
    elif operator == '*':
        return a * b
    elif operator == '/':
        return a / b if b != 0 else "Error: Division by zero"
    elif operator == '//':
        return a // b if b != 0 else "Error: Division by zero"
    elif operator == '%':
        return a % b if b != 0 else "Error: Division by zero"
    elif operator == '**':
        return a ** b
    else:
        return "Error: Invalid operator"

def main():
    print("=== Simple Calculator Demo ===")
    operations = [
        (10, 5, '+'),
        (20, 8, '-'),
        (4, 7, '*'),
        (15, 4, '/'),
        (15, 4, '//'),
        (15, 4, '%'),
        (2, 5, '**'),
        (10, 0, '/'),
    ]

    for a, b, op in operations:
        res = calculate(a, b, op)
        print(f"{a} {op} {b} = {res}")

if __name__ == "__main__":
    main()
