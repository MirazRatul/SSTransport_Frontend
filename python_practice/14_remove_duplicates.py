"""
Problem 14: Remove Duplicates from a List
------------------------------------------
Question:
Write functions to remove duplicate elements from a list:
1. Using set conversion (order not guaranteed).
2. Using a loop/dict key insertion (maintains original order).
"""

def remove_duplicates_set(items: list) -> list:
    return list(set(items))

def remove_duplicates_preserve_order(items: list) -> list:
    seen = set()
    result = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

def main():
    sample_list = [1, 3, 5, 3, 2, 1, 5, 4, 2, 6, 3]
    print("=== Remove Duplicates Demo ===")
    print(f"Original List                : {sample_list}")

    no_dups_set = remove_duplicates_set(sample_list)
    print(f"Using set (unordered)        : {no_dups_set}")

    no_dups_ordered = remove_duplicates_preserve_order(sample_list)
    print(f"Preserving order (ordered)   : {no_dups_ordered}")

if __name__ == "__main__":
    main()
