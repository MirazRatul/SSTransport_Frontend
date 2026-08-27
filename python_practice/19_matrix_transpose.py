"""
Problem 19: Transpose of a 2D Matrix
-------------------------------------
Question:
Write a Python program to calculate the transpose of a given 2D matrix 
(swapping rows and columns) using:
1. Nested loops
2. List comprehension
3. Zip function (*zip)
"""

def transpose_nested_loops(matrix: list) -> list:
    rows = len(matrix)
    cols = len(matrix[0])
    transposed = []
    for c in range(cols):
        new_row = []
        for r in range(rows):
            new_row.append(matrix[r][c])
        transposed.append(new_row)
    return transposed

def transpose_comprehension(matrix: list) -> list:
    return [[matrix[r][c] for r in range(len(matrix))] for c in range(len(matrix[0]))]

def transpose_zip(matrix: list) -> list:
    return [list(row) for row in zip(*matrix)]

def main():
    original = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]

    print("=== Matrix Transpose Demo ===")
    print("Original Matrix:")
    for row in original:
        print(row)

    print("\nTransposed (Comprehension):")
    for row in transpose_comprehension(original):
        print(row)

    print("\nTransposed (Zip Trick):")
    for row in transpose_zip(original):
        print(row)

if __name__ == "__main__":
    main()
