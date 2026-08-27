"""
Problem 35: Dictionary Merging & Deep Retrieval
------------------------------------------------
Question:
Demonstrate different techniques to merge Python dictionaries (Unpacking `**`, Merge operator `|`, `update()`)
and safely access deeply nested dictionary values without causing KeyError exceptions.
"""

def safe_get(dictionary: dict, keys: list, default=None):
    """Safely retrieves a value from a nested dictionary given a list of keys."""
    current = dictionary
    for k in keys:
        if isinstance(current, dict) and k in current:
            current = current[k]
        else:
            return default
    return current

def main():
    dict1 = {"a": 1, "b": 2}
    dict2 = {"b": 99, "c": 3}  # 'b' overlaps

    print("=== Dictionary Merging Demo ===")
    
    # 1. Merging with unpacking operator **
    merged_unpack = {**dict1, **dict2}
    print(f"Merged (** operator) : {merged_unpack}")

    # 2. Merging with Python 3.9+ | operator
    merged_pipe = dict1 | dict2
    print(f"Merged (| operator)  : {merged_pipe}")

    # 3. Nested dictionary safe access
    nested_data = {
        "user": {
            "profile": {
                "name": "Alice",
                "settings": {"theme": "dark"}
            }
        }
    }

    print("\n--- Safe Nested Retrieval ---")
    theme = safe_get(nested_data, ["user", "profile", "settings", "theme"], default="light")
    language = safe_get(nested_data, ["user", "profile", "settings", "language"], default="en-US")
    print(f"Retrieved Theme   : {theme}")
    print(f"Retrieved Language: {language}")

if __name__ == "__main__":
    main()
