"""
Problem 36: CSV File Reading & Writing
--------------------------------------
Question:
Write a Python program using the built-in `csv` module to:
1. Write structured data (list of dictionaries) into a CSV file using `csv.DictWriter`.
2. Read data back from the CSV file using `csv.DictReader` and display formatted output.
3. Automatically clean up temporary test files.
"""

import csv
import os

CSV_FILE = "sample_data_output.csv"

def demo_csv_operations():
    students_data = [
        {"id": 1, "name": "Alice", "grade": 92, "city": "New York"},
        {"id": 2, "name": "Bob", "grade": 85, "city": "London"},
        {"id": 3, "name": "Charlie", "grade": 78, "city": "Tokyo"}
    ]

    fieldnames = ["id", "name", "grade", "city"]

    # 1. Writing to CSV file
    with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(students_data)
    print(f"[+] Successfully wrote CSV data to '{CSV_FILE}'")

    # 2. Reading from CSV file
    print("\n--- Reading CSV Data ---")
    with open(CSV_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            print(f"ID: {row['id']:2s} | Name: {row['name']:10s} | Grade: {row['grade']:4s} | City: {row['city']}")

    # 3. Clean up sample CSV file
    if os.path.exists(CSV_FILE):
        os.remove(CSV_FILE)
        print(f"\n[+] Cleaned up temporary file '{CSV_FILE}'")

def main():
    print("=== CSV Handling Demo ===")
    demo_csv_operations()

if __name__ == "__main__":
    main()
