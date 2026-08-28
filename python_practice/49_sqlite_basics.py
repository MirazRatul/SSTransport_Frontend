"""
Problem 49: Embedded SQLite Database CRUD Operations
---------------------------------------------------
Question:
Write a Python script using `sqlite3` to:
1. Create an in-memory SQLite database and table `products`.
2. Perform CRUD operations: Create (INSERT), Read (SELECT), Update (UPDATE), and Delete (DELETE).
"""

import sqlite3

def main():
    print("=== SQLite CRUD Operations Demo ===")
    
    # Connect to in-memory database
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    # 1. CREATE Table
    cursor.execute("""
        CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )
    """)

    # 2. INSERT (Create)
    sample_products = [("Laptop", 999.99), ("Headphones", 149.50), ("Keyboard", 79.99)]
    cursor.executemany("INSERT INTO products (name, price) VALUES (?, ?)", sample_products)
    conn.commit()
    print(f"[+] Inserted {len(sample_products)} products.")

    # 3. SELECT (Read)
    cursor.execute("SELECT * FROM products")
    print("\n--- Current Products ---")
    for row in cursor.fetchall():
        print(f"ID: {row[0]} | Name: {row[1]:12s} | Price: ${row[2]:.2f}")

    # 4. UPDATE
    cursor.execute("UPDATE products SET price = ? WHERE name = ?", (129.99, "Headphones"))
    conn.commit()

    # 5. DELETE
    cursor.execute("DELETE FROM products WHERE name = ?", ("Keyboard",))
    conn.commit()

    # Verify final state
    cursor.execute("SELECT * FROM products")
    print("\n--- Products After Update & Delete ---")
    for row in cursor.fetchall():
        print(f"ID: {row[0]} | Name: {row[1]:12s} | Price: ${row[2]:.2f}")

    conn.close()

if __name__ == "__main__":
    main()
