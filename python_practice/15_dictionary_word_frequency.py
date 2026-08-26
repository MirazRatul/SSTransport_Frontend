"""
Problem 15: Word Frequency Counter
----------------------------------
Question:
Write a Python program to count the occurrences of each word in a given text paragraph 
using a Python dictionary, sorting words by frequency in descending order.
"""

import re

def count_word_frequencies(text: str) -> dict:
    # Clean text: convert to lowercase and remove non-alphanumeric characters
    words = re.findall(r'\b\w+\b', text.lower())
    
    frequency = {}
    for word in words:
        frequency[word] = frequency.get(word, 0) + 1
        
    # Sort dictionary by frequency descending
    sorted_freq = dict(sorted(frequency.items(), key=lambda item: item[1], reverse=True))
    return sorted_freq

def main():
    paragraph = """
    Python is a popular programming language. Python is used for web development,
    data science, software creation, and system scripting. Learning Python is fun and easy!
    """
    print("=== Word Frequency Counter ===")
    print("Paragraph:")
    print(paragraph.strip())
    print("\nWord Frequencies:")

    freq = count_word_frequencies(paragraph)
    for word, count in freq.items():
        print(f"  {word:15s}: {count}")

if __name__ == "__main__":
    main()
