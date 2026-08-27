"""
Problem 38: Recursive Flattening of Nested Lists
-------------------------------------------------
Question:
Write a recursive function `flatten_list(nested_list)` that takes an arbitrarily 
nested list structure (e.g. `[1, [2, [3, 4], 5], 6]`) and returns a flat 1D list.
"""

def flatten_list(nested: list) -> list:
    flat = []
    for item in nested:
        if isinstance(item, list):
            flat.extend(flatten_list(item))
        else:
            flat.append(item)
    return flat

def main():
    complex_nested = [1, [2, [3, 4], 5], 6, [[7, 8], 9], 10]
    print("=== Flatten Nested List Demo ===")
    print(f"Nested Input List : {complex_nested}")

    flattened = flatten_list(complex_nested)
    print(f"Flattened Result  : {flattened}")

if __name__ == "__main__":
    main()
