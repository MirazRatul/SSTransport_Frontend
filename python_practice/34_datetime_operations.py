"""
Problem 34: Datetime Manipulation & Formatting
----------------------------------------------
Question:
Write a Python program using the `datetime` module to:
1. Display current date and time in custom formatted string (e.g. `YYYY-MM-DD HH:MM:SS`).
2. Calculate date differences (timedelta) such as days until a future date or age calculation.
3. Parse string timestamps into datetime objects (`strptime`).
"""

from datetime import datetime, timedelta

def main():
    print("=== Datetime Operations Demo ===")
    
    # 1. Current Date & Time
    now = datetime.now()
    print(f"Current Datetime : {now.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Formatted Date   : {now.strftime('%A, %B %d, %Y')}")

    # 2. Date Arithmetic (Timedelta)
    future_date = now + timedelta(days=30, hours=5)
    print(f"30 Days Later    : {future_date.strftime('%Y-%m-%d %H:%M:%S')}")

    # 3. Parsing String to Datetime
    date_str = "2026-12-31 23:59:59"
    parsed_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    time_remaining = parsed_date - now
    print(f"\nTarget Date      : {parsed_date}")
    print(f"Time Remaining   : {time_remaining.days} days, {time_remaining.seconds // 3600} hours")

if __name__ == "__main__":
    main()
