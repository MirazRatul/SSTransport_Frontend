"""
Problem 24: Object-Oriented Programming (OOP) - Bank Account Class
-------------------------------------------------------------------
Question:
Design a `BankAccount` class with encapsulation principles:
- Attributes: `account_holder` (public), `_account_number` (protected), `__balance` (private)
- Methods: `deposit(amount)`, `withdraw(amount)`, `get_balance()`, `__str__()`
"""

class BankAccount:
    def __init__(self, account_holder: str, initial_balance: float = 0.0):
        self.account_holder = account_holder
        self.__balance = initial_balance

    def deposit(self, amount: float):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        self.__balance += amount
        print(f"[+] Deposited ${amount:.2f}. New Balance: ${self.__balance:.2f}")

    def withdraw(self, amount: float):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")
        if amount > self.__balance:
            print(f"[!] Insufficient funds! Current Balance: ${self.__balance:.2f}")
            return False
        self.__balance -= amount
        print(f"[-] Withdrew ${amount:.2f}. Remaining Balance: ${self.__balance:.2f}")
        return True

    def get_balance(self) -> float:
        return self.__balance

    def __str__(self):
        return f"Account Holder: {self.account_holder} | Balance: ${self.__balance:.2f}"

def main():
    print("=== Bank Account OOP Demo ===")
    account = BankAccount("John Doe", 500.0)
    print(account)

    account.deposit(250.0)
    account.withdraw(100.0)
    account.withdraw(1000.0)  # Should fail due to insufficient funds

    print(f"Final Verified Balance: ${account.get_balance():.2f}")

if __name__ == "__main__":
    main()
