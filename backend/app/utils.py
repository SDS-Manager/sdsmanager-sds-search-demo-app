from cryptography.fernet import Fernet
from app.core.config import settings


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


def update_search_id(response_json, sds_id, access_key_match, search_key="id", allow_none=False):
    search_id = response_json.get(search_key)  # Initialize search_id from the current value in response_json

    if sds_id:
        for item in sds_id:
            if item.get("id") == search_id:
                if access_key_match:
                    search_id = item.get("encrypt")  # Assign encrypted value if access_key_match is True
                response_json["encryption_search_id"] = item.get("encrypt")

    if access_key_match:
        # If access_key_match is True, update search_id in response_json
        response_json["search_id"] = encrypt_number(search_id, settings.SECRET_KEY) if not sds_id else search_id
        # Ensure encryption_search_id matches search_id if search_id is encrypted
        response_json["encryption_search_id"] = response_json["search_id"]
    else:
        # If access_key_match is False, keep the original search_id
        response_json["search_id"] = search_id

    # Ensure search_id is not None, unless allow_none is True
    if response_json["search_id"] is None and not allow_none:
        response_json["search_id"] = encrypt_number(search_id, settings.SECRET_KEY)
        # Ensure encryption_search_id matches search_id if search_id is encrypted
        response_json["encryption_search_id"] = response_json["search_id"]
