"""
Problem 02: Variables & Data Types
-----------------------------------
Question:
Create variables of various primitive and collection data types in Python 
(integer, float, string, boolean, list, tuple, dictionary, set) and display 
their values along with their respective data types using type().
"""

def main():
    # Primitive Data Types
    age = 25                      # int
    height = 5.9                  # float
    name = "Alice"                # str
    is_student = True             # bool

    # Collection Data Types
    skills = ["Python", "JS", "SQL"]          # list
    coordinates = (10.0, 20.0)                 # tuple
    user_info = {"name": name, "age": age}    # dict
    unique_numbers = {1, 2, 3, 3, 2, 1}        # set

    print("--- Primitive Data Types ---")
    print(f"age: {age} | type: {type(age)}")
    print(f"height: {height} | type: {type(height)}")
    print(f"name: '{name}' | type: {type(name)}")
    print(f"is_student: {is_student} | type: {type(is_student)}")

    print("\n--- Collection Data Types ---")
    print(f"skills: {skills} | type: {type(skills)}")
    print(f"coordinates: {coordinates} | type: {type(coordinates)}")
    print(f"user_info: {user_info} | type: {type(user_info)}")
    print(f"unique_numbers: {unique_numbers} | type: {type(unique_numbers)}")

if __name__ == "__main__":
    main()
