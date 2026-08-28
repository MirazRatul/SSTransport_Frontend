"""
Problem 48: Shallow Copy vs Deep Copy
-------------------------------------
Question:
Demonstrate the difference between assignment (`=`), shallow copy (`copy.copy()`), 
and deep copy (`copy.deepcopy()`) when duplicating compound objects containing nested mutable lists.
"""

import copy

def main():
    original = [1, [2, 3], 4]
    
    # 1. Assignment (Reference copy)
    ref_copy = original

    # 2. Shallow Copy
    shallow = copy.copy(original)

    # 3. Deep Copy
    deep = copy.deepcopy(original)

    print("=== Initial State ===")
    print(f"Original : {original}")
    print(f"Shallow  : {shallow}")
    print(f"Deep     : {deep}\n")

    # Modify nested element in original
    original[1].append(999)
    original[0] = 100

    print("=== After Modifying Original: original[1].append(999) & original[0]=100 ===")
    print(f"Original (modified) : {original}")
    print(f"Reference Copy      : {ref_copy}   <-- Reflects both top-level and nested changes")
    print(f"Shallow Copy        : {shallow}   <-- Top-level isolated, but nested list mutated!")
    print(f"Deep Copy           : {deep}   <-- Completely isolated, untouched!")

if __name__ == "__main__":
    main()
