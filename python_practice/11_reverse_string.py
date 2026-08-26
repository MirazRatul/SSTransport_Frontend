"""
Problem 11: String Reversal & Palindrome Checker
------------------------------------------------
Question:
Write Python functions to:
1. Reverse a given string using slicing and a loop.
2. Check if a string is a palindrome (reads the same forward and backward),
   ignoring spaces, punctuation, and letter case.
"""

def reverse_string_slicing(text: str) -> str:
    return text[::-1]

def reverse_string_loop(text: str) -> str:
    reversed_str = ""
    for char in text:
        reversed_str = char + reversed_str
    return reversed_str

def is_palindrome(text: str) -> bool:
    cleaned = "".join(char.lower() for char in text if char.isalnum())
    return cleaned == cleaned[::-1]

def main():
    print("=== String Reversal & Palindrome Check ===")
    sample = "Python"
    print(f"Original String: '{sample}'")
    print(f"Reversed (slicing): '{reverse_string_slicing(sample)}'")
    print(f"Reversed (loop)   : '{reverse_string_loop(sample)}'\n")

    test_phrases = [
        "racecar",
        "A man, a plan, a canal: Panama",
        "Hello World",
        "No lemon, no melon"
    ]

    for phrase in test_phrases:
        result = "PALINDROME" if is_palindrome(phrase) else "NOT a palindrome"
        print(f"'{phrase}' -> {result}")

if __name__ == "__main__":
    main()
