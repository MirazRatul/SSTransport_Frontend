"""
Problem 12: Count Vowels, Consonants, and Digits
------------------------------------------------
Question:
Write a Python script that analyzes a text string and counts the total number 
of vowels (a, e, i, o, u), consonants, digits, and whitespace/special characters.
"""

def analyze_string(text: str) -> dict:
    vowels = "aeiouAEIOU"
    counts = {
        "vowels": 0,
        "consonants": 0,
        "digits": 0,
        "spaces": 0,
        "special": 0
    }

    for char in text:
        if char in vowels:
            counts["vowels"] += 1
        elif char.isalpha():
            counts["consonants"] += 1
        elif char.isdigit():
            counts["digits"] += 1
        elif char.isspace():
            counts["spaces"] += 1
        else:
            counts["special"] += 1

    return counts

def main():
    sample_text = "Python 3.10 is Awesome! #Code2026"
    print("=== Text Analysis Tool ===")
    print(f"Sample Input: '{sample_text}'\n")

    results = analyze_string(sample_text)
    for category, count in results.items():
        print(f"{category.capitalize():12s}: {count}")

if __name__ == "__main__":
    main()
