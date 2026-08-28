"""
Problem 51: Zip Archives & File Compression
--------------------------------------------
Question:
Write a Python program using `zipfile` to:
1. Create a zip archive containing multiple text files.
2. Read and extract files from the zip archive.
3. Inspect zip archive metadata (file names, compressed size, uncompressed size).
"""

import zipfile
import os

ZIP_NAME = "demo_archive.zip"
TEST_FILES = {"doc1.txt": "Content of document 1\n", "doc2.txt": "Content of document 2\n"}

def demo_zip_archive():
    # 1. Create temporary test files
    for fname, content in TEST_FILES.items():
        with open(fname, "w") as f:
            f.write(content)

    # 2. Write to Zip Archive
    with zipfile.ZipFile(ZIP_NAME, "w", compression=zipfile.ZIP_DEFLATED) as zipf:
        for fname in TEST_FILES.keys():
            zipf.write(fname)
            print(f"[+] Added '{fname}' to '{ZIP_NAME}'")

    # 3. Inspect Archive Contents
    print("\n--- Zip Archive Contents ---")
    with zipfile.ZipFile(ZIP_NAME, "r") as zipf:
        for info in zipf.infolist():
            print(f"File: {info.filename:10s} | Size: {info.file_size} B | Compressed: {info.compress_size} B")

    # 4. Clean up created files & zip
    for fname in TEST_FILES.keys():
        if os.path.exists(fname):
            os.remove(fname)
    if os.path.exists(ZIP_NAME):
        os.remove(ZIP_NAME)
    print("\n[+] Cleaned up temporary test files and zip archive.")

def main():
    print("=== Zip File Operations Demo ===")
    demo_zip_archive()

if __name__ == "__main__":
    main()
