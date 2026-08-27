"""
Problem 30: JSON Parsing & Serialization
-----------------------------------------
Question:
Write a Python program to:
1. Parse a JSON string into a Python dictionary (`json.loads`).
2. Modify the dictionary data.
3. Serialize the Python object back into a formatted JSON string (`json.dumps`).
"""

import json

def main():
    json_data = """
    {
        "company": "TechCorp",
        "employees": [
            {"id": 101, "name": "Alice", "role": "Developer", "skills": ["Python", "Docker"]},
            {"id": 102, "name": "Bob", "role": "Designer", "skills": ["Figma", "CSS"]}
        ],
        "active": true
    }
    """

    print("=== JSON Parsing & Serialization ===")
    
    # 1. Parse JSON string to Python Dict
    data = json.loads(json_data)
    print(f"Company Name: {data['company']}")
    print(f"Total Employees: {len(data['employees'])}\n")

    # 2. Modify data
    new_employee = {"id": 103, "name": "Charlie", "role": "DevOps", "skills": ["Kubernetes", "Linux"]}
    data["employees"].append(new_employee)

    # 3. Serialize back to formatted JSON
    pretty_json = json.dumps(data, indent=4)
    print("--- Updated Formatted JSON ---")
    print(pretty_json)

if __name__ == "__main__":
    main()
