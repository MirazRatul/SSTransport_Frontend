"""
Problem 01: Hello World & Basic Printing
----------------------------------------
Question:
Write a Python program to display a greeting message "Hello, World!" 
and print a multi-line message about starting Python practice.
"""

def main():
    # Basic print statement
    print("Hello, World!")
    print("Welcome to Python Programming Practice.")
    print("This is exercise 01 of 18 beginner topics.\n")

    # Multi-line string printing
    learning_goals = """
Python Fundamentals:
  1. Syntax & Data Types
  2. Control Flow & Loops
  3. Functions & Data Structures
  4. File Operations
"""
    print(learning_goals)

if __name__ == "__main__":
    main()
