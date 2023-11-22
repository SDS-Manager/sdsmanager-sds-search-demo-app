from cryptography.fernet import Fernet


# Encrypt number to a secret string
def encrypt_number(number, key):
    cipher_suite = Fernet(key)
    encrypted_number = cipher_suite.encrypt(str(number).encode())
    return encrypted_number


# Decrypt secret string back to the original number
def decrypt_to_number(encrypted_number, key):
    cipher_suite = Fernet(key)
    decrypted_number = cipher_suite.decrypt(encrypted_number)
    return int(decrypted_number.decode())
