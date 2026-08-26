"""
Problem 18: Basic File I/O Operations
--------------------------------------
Question:
Write a Python program that:
1. Creates and writes text data to a sample text file.
2. Appends additional content to the file.
3. Reads the file back line by line using a context manager ('with' statement).
4. Counts total lines and total words in the file, then safely cleans up the file.
"""

import os

FILE_NAME = "sample_practice_output.txt"

def write_and_read_file():
    lines_to_write = [
        "Line 1: Python file handling tutorial.\n",
        "Line 2: Context managers ensure safe file closure.\n",
        "Line 3: Reading and writing files is fundamental.\n"
    ]

    # 1. Writing to file
    with open(FILE_NAME, "w", encoding="utf-8") as f:
        f.writelines(lines_to_write)
    print(f"[+] Successfully wrote {len(lines_to_write)} lines to '{FILE_NAME}'")

    # 2. Appending to file
    with open(FILE_NAME, "a", encoding="utf-8") as f:
        f.write("Line 4: This line was appended later.\n")
    print(f"[+] Appended extra content to '{FILE_NAME}'")

    # 3. Reading and analyzing file
    print("\n--- Reading File Content ---")
    line_count = 0
    word_count = 0

    with open(FILE_NAME, "r", encoding="utf-8") as f:
        for line in f:
            line_count += 1
            words = line.split()
            word_count += len(words)
            print(f"{line_count}: {line.strip()}")

    print(f"\n[Summary] Total Lines: {line_count} | Total Words: {word_count}")

    # 4. Clean up sample file
    if os.path.exists(FILE_NAME):
        os.remove(FILE_NAME)
        print(f"[+] Cleaned up temporary file '{FILE_NAME}'")

def main():
    print("=== File I/O Basics Demo ===")
    write_and_read_file()

if __name__ == "__main__":
    main()
