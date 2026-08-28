"""
Problem 45: Custom Exception Classes & Hierarchy
------------------------------------------------
Question:
Define a domain-specific custom exception hierarchy inheriting from `Exception` 
(e.g., `ApplicationError`, `ValidationError`, `InsufficientBalanceError`) and demonstrate exception raising and handling.
"""

class ApplicationError(Exception):
    """Base exception class for application domain."""
    pass

class ValidationError(ApplicationError):
    """Raised when user input validation fails."""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"Validation failed for '{field}': {message}")

class InsufficientBalanceError(ApplicationError):
    """Raised when account balance is insufficient."""
    def __init__(self, balance: float, required: float):
        self.balance = balance
        self.required = required
        super().__init__(f"Balance ${balance:.2f} insufficient for transaction requirement ${required:.2f}")

def process_withdrawal(balance: float, amount: float):
    if amount <= 0:
        raise ValidationError("amount", "Withdrawal amount must be strictly greater than 0.")
    if amount > balance:
        raise InsufficientBalanceError(balance, amount)
    return balance - amount

def main():
    print("=== Custom Exception Hierarchy Demo ===")
    
    test_cases = [
        (100.0, -50.0),   # Triggers ValidationError
        (50.0, 200.0),    # Triggers InsufficientBalanceError
        (500.0, 150.0)    # Valid case
    ]

    for balance, amount in test_cases:
        try:
            print(f"\nAttempting withdrawal of ${amount} from balance ${balance}...")
            new_bal = process_withdrawal(balance, amount)
            print(f"[Success] Remaining balance: ${new_bal:.2f}")
        except ApplicationError as err:
            print(f"[Caught {err.__class__.__name__}]: {err}")

if __name__ == "__main__":
    main()
