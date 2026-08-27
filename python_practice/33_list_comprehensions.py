"""
Problem 33: Advanced Comprehensions (List, Dict, Set)
------------------------------------------------------
Question:
Write concise Python code using:
1. List comprehension with nested `if-else` conditionals.
2. Dictionary comprehension to swap keys and values or transform elements.
3. Set comprehension to extract unique word lengths.
"""

def main():
    print("=== Advanced Comprehensions Demo ===")
    
    # 1. List Comprehension: Square evens, cube odds
    numbers = range(1, 11)
    transformed = [x ** 2 if x % 2 == 0 else x ** 3 for x in numbers]
    print(f"Original numbers : {list(numbers)}")
    print(f"Transformed list : {transformed}\n")

    # 2. Dictionary Comprehension: Swap dict keys and values
    original_dict = {"a": 1, "b": 2, "c": 3}
    inverted_dict = {val: key for key, val in original_dict.items()}
    print(f"Original Dict    : {original_dict}")
    print(f"Inverted Dict    : {inverted_dict}\n")

    # 3. Set Comprehension: Unique word lengths
    sentence = "the quick brown fox jumps over the lazy dog"
    word_lengths = {len(word) for word in sentence.split()}
    print(f"Sentence         : '{sentence}'")
    print(f"Unique Lengths   : {sorted(list(word_lengths))}")

if __name__ == "__main__":
    main()
