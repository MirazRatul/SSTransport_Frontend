"""
Problem 53: Cryptographic Data Hashing SHA-256 (`hashlib`)
---------------------------------------------------------
Question:
Write a Python program using `hashlib` to:
1. Compute cryptographic SHA-256 hash digests for text strings.
2. Hash passwords with a random cryptographic salt (`secrets` module).
3. Verify provided credentials against stored salted hash digests.
"""

import hashlib
import secrets

def hash_password(password: str, salt: bytes = None) -> tuple[str, str]:
    if salt is None:
        salt = secrets.token_bytes(16)
    
    # Hash password with salt using SHA-256
    pwd_bytes = password.encode('utf-8')
    hash_obj = hashlib.sha256(salt + pwd_bytes)
    
    salt_hex = salt.hex()
    digest_hex = hash_obj.hexdigest()
    return digest_hex, salt_hex

def verify_password(stored_hash: str, stored_salt: str, password_to_check: str) -> bool:
    salt_bytes = bytes.fromhex(stored_salt)
    calculated_hash, _ = hash_password(password_to_check, salt_bytes)
    return secrets.compare_digest(stored_hash, calculated_hash)

def main():
    print("=== Cryptographic Hashing (SHA-256) Demo ===")
    
    # 1. Basic String Hash
    message = "Python Practice 2026"
    raw_hash = hashlib.sha256(message.encode('utf-8')).hexdigest()
    print(f"Message : '{message}'")
    print(f"SHA-256 : {raw_hash}\n")

    # 2. Salted Password Hashing & Verification
    secret_pass = "MySuperSecretPass123"
    pwd_hash, salt = hash_password(secret_pass)
    print("--- Salted Password Storage ---")
    print(f"Salt (Hex)   : {salt}")
    print(f"Stored Hash  : {pwd_hash}\n")

    # 3. Verifying attempts
    valid = verify_password(pwd_hash, salt, "MySuperSecretPass123")
    invalid = verify_password(pwd_hash, salt, "WrongPassword")

    print(f"Correct Password Verification: {valid}")
    print(f"Wrong Password Verification  : {invalid}")

if __name__ == "__main__":
    main()
