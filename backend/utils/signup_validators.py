# backend/utils/signup_validators.py

import re

def is_valid_username(username: str) -> bool:
    # Username must be 4–20 characters long, letters, digits, underscore, or dot
    return re.match(r'^[A-Za-z0-9_.]{4,20}$', username) is not None

def is_valid_email(email: str) -> bool:
    regex = r'^\S+@\S+\.\S+$'
    return re.match(regex, email) is not None

def is_valid_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if not re.search(r'[A-Za-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True

def is_valid_name(name: str) -> bool:
    return bool(name) and re.match(r'^[A-Za-z\s]+$', name)

def is_valid_unit_number(unit_number: str) -> bool:
    return bool(unit_number.strip())

def is_valid_building(building: str) -> bool:
    return bool(building.strip())
