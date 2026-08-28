"""
Problem 54: Command Line Option Parser (`argparse`)
--------------------------------------------------
Question:
Write a Python command-line utility using `argparse` to parse positional arguments, 
optional flags, type casting, default values, and help descriptions.
"""

import argparse
import sys

def create_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="CLI Greeter & Math Tool built with argparse.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    # Positional argument
    parser.add_argument("name", type=str, help="User's name to greet")
    # Optional flags
    parser.add_argument("-c", "--count", type=int, default=1, help="Number of times to repeat greeting")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose debug output")
    return parser

def main(args=None):
    parser = create_parser()
    
    # Parse provided args or fallback to sample default args for demonstration
    if args is None and len(sys.argv) == 1:
        args = ["Alice", "--count", "3", "--verbose"]

    parsed_args = parser.parse_args(args)

    print("=== Command Line Option Parser (argparse) Demo ===")
    if parsed_args.verbose:
        print(f"[Debug] Parsed Arguments: {parsed_args}")

    for i in range(1, parsed_args.count + 1):
        print(f"[{i}] Hello, {parsed_args.name}!")

if __name__ == "__main__":
    main()
