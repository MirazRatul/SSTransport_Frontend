"""
Problem 43: Thread-safe Singleton Design Pattern
------------------------------------------------
Question:
Implement a thread-safe Singleton class `DatabaseConnection` in Python using 
metaclasses and locks, ensuring that only one instance of the class can ever exist.
"""

import threading

class SingletonMeta(type):
    _instances = {}
    _lock: threading.Lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance
        return cls._instances[cls]

class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self, db_name: str = "ProductionDB"):
        self.db_name = db_name
        self.connected = True

    def query(self, sql: str) -> str:
        return f"[{self.db_name}] Executed: '{sql}'"

def main():
    print("=== Thread-Safe Singleton Pattern Demo ===")
    
    db1 = DatabaseConnection("PrimaryDB")
    db2 = DatabaseConnection("SecondaryDB")  # Will return db1 instance

    print(f"db1 Memory Address : {hex(id(db1))}")
    print(f"db2 Memory Address : {hex(id(db2))}")
    print(f"Are db1 and db2 identical instances? {db1 is db2}")

    print(db1.query("SELECT * FROM users;"))

if __name__ == "__main__":
    main()
