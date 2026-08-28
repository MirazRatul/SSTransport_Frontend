"""
Problem 50: System Commands & Subprocess Execution
--------------------------------------------------
Question:
Write a Python program using `subprocess.run()` to execute system shell commands 
(e.g., `python3 --version`, `echo`), capture stdout/stderr, handle return codes, 
and catch `CalledProcessError` exceptions securely.
"""

import subprocess
import sys

def run_command_safely(command_list: list):
    print(f"Executing Command: {' '.join(command_list)}")
    try:
        result = subprocess.run(
            command_list,
            capture_output=True,
            text=True,
            check=True
        )
        print(f"[Exit Code]: {result.returncode}")
        print(f"[Stdout]   : {result.stdout.strip()}")
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"[Error] Command failed with exit code {e.returncode}")
        print(f"[Stderr]: {e.stderr.strip()}")
        return None

def main():
    print("=== Subprocess Management Demo ===")
    
    # 1. Execute python3 version check
    run_command_safely([sys.executable, "--version"])

    # 2. Execute echo command
    print()
    run_command_safely(["echo", "Hello from Python Subprocess!"])

if __name__ == "__main__":
    main()
