"""
Problem 37: Caesar Cipher Encryption & Decryption
--------------------------------------------------
Question:
Implement the Caesar Cipher encryption and decryption algorithm in Python.
The cipher shifts each letter in a text by a fixed integer key value, 
preserving uppercase and lowercase character casing while leaving non-alphabetic characters intact.
"""

def caesar_encrypt(plain_text: str, shift: int) -> str:
    encrypted = []
    shift = shift % 26
    for char in plain_text:
        if char.isupper():
            new_char = chr((ord(char) - ord('A') + shift) % 26 + ord('A'))
            encrypted.append(new_char)
        elif char.islower():
            new_char = chr((ord(char) - ord('a') + shift) % 26 + ord('a'))
            encrypted.append(new_char)
        else:
            encrypted.append(char)
    return "".join(encrypted)

def caesar_decrypt(cipher_text: str, shift: int) -> str:
    return caesar_encrypt(cipher_text, -shift)

def main():
    original_message = "Hello, World! Python Secret 2026."
    shift_key = 5

    print("=== Caesar Cipher Demo ===")
    print(f"Original Text : '{original_message}'")
    print(f"Shift Key     : {shift_key}\n")

    encrypted_msg = caesar_encrypt(original_message, shift_key)
    print(f"Encrypted     : '{encrypted_msg}'")

    decrypted_msg = caesar_decrypt(encrypted_msg, shift_key)
    print(f"Decrypted     : '{decrypted_msg}'")

if __name__ == "__main__":
    main()
