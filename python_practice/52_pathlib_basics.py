"""
Problem 52: Modern File System Operations (`pathlib.Path`)
---------------------------------------------------------
Question:
Write Python code using the `pathlib` module (`Path` class) to:
1. Construct file paths in an OS-independent manner.
2. Check path existence, extension, stem, parent directory, and file size.
3. Search for files using wildcard globbing (`Path.glob()`).
"""

from pathlib import Path

def main():
    print("=== Modern pathlib.Path Demonstration ===")
    
    # 1. Path construction & properties
    current_dir = Path(".")
    current_file = Path(__file__).resolve()

    print(f"Current Directory Path : {current_dir.resolve()}")
    print(f"File Absolute Path     : {current_file}")
    print(f"File Name (name)       : {current_file.name}")
    print(f"File Stem (without ext): {current_file.stem}")
    print(f"File Extension (suffix): {current_file.suffix}")
    print(f"Parent Directory       : {current_file.parent.name}")
    print(f"File Exists?           : {current_file.exists()}")
    print(f"Is File?               : {current_file.is_file()}")
    print(f"File Size              : {current_file.stat().st_size} bytes")

    # 2. Glob pattern matching
    print("\n--- Python Files in Practice Directory ---")
    py_files = list(current_file.parent.glob("*.py"))
    print(f"Total .py files found: {len(py_files)}")

if __name__ == "__main__":
    main()
