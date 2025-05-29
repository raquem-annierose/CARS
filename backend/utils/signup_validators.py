# backend/utils/signup_validators.py

import re

def is_valid_username(username: str) -> bool:
    # Example: username must be exactly 8 characters long
    return len(username) == 8

def is_valid_email(email: str) -> bool:
    # Basic regex for validating email format
    regex = r'^\S+@\S+\.\S+$'
    return re.match(regex, email) is not None

def is_valid_password(password: str) -> bool:
    # Password must be at least 8 characters, contain at least one letter and one digit
    if len(password) < 8:
        return False
    if not re.search(r'[A-Za-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True

def is_valid_name(name: str) -> bool:
    # Names must be non-empty and only letters and spaces (adjust if needed)
    return bool(name) and re.match(r'^[A-Za-z\s]+$', name)

def is_valid_unit_number(unit_number: str) -> bool:
    # Customize based on your unit number format, here just non-empty
    return bool(unit_number.strip())

def is_valid_building(building: str) -> bool:
    # Customize as needed, here just non-empty check
    return bool(building.strip())
