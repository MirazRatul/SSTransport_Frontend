"""
Problem 31: Regular Expressions - Email & Phone Number Validator
------------------------------------------------------------------
Question:
Write validation functions using Python's `re` module:
1. `validate_email(email)`: Validates email address format.
2. `validate_phone(phone)`: Validates 10-digit phone numbers (with optional dashes/spaces).
"""

import re

def validate_email(email: str) -> bool:
    # Pattern matching user@domain.com / user.name@domain.co.uk
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone: str) -> bool:
    # Pattern matching 10 digit phone number e.g. 123-456-7890 or 1234567890
    pattern = r'^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
    return bool(re.match(pattern, phone))

def main():
    print("=== Regex Input Validation Demo ===")
    
    test_emails = [
        "user.name@example.com",
        "invalid-email@.com",
        "john.doe@company.org",
        "plainaddress"
    ]

    print("--- Email Validation ---")
    for email in test_emails:
        status = "VALID" if validate_email(email) else "INVALID"
        print(f"{email:25s} -> {status}")

    test_phones = [
        "123-456-7890",
        "(123) 456-7890",
        "1234567890",
        "123-abc-7890"
    ]

    print("\n--- Phone Number Validation ---")
    for phone in test_phones:
        status = "VALID" if validate_phone(phone) else "INVALID"
        print(f"{phone:20s} -> {status}")

if __name__ == "__main__":
    main()
